// src/actions/customer-actions.ts
'use server';

import { getCustomersCollection, getOrderRequestsCollection, getInquiriesCollection } from '@/lib/mongodb';
import type { Customer, NewCustomerInput, OrderRequest, Inquiry } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid';
import type { Collection, WithId, Filter } from 'mongodb';

// IMPORTANT: In a real application, passwords should be hashed before saving.
// For this simulation, we'll store it as plain text, but this is NOT secure for production.
// Consider using a library like bcrypt.js for hashing.

export async function saveCustomer(data: NewCustomerInput): Promise<{ success: boolean; data?: Omit<Customer, 'password' | '_id'>; error?: string }> {
  console.log('[Action: saveCustomer] Received data for customer registration:', JSON.stringify(data));
  try {
    const collection: Collection<Customer> = await getCustomersCollection();

    if (!data.name || !data.email || !data.password) {
      console.error('[Action: saveCustomer] Validation failed: Name, email, and password are required.');
      return { success: false, error: 'Name, email, and password are required.' };
    }
    if (data.password.trim().length < 6) { 
        console.error('[Action: saveCustomer] Validation failed: Password too short.');
        return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const normalizedEmail = data.email.toLowerCase().trim();

    const existingCustomer = await collection.findOne({ email: normalizedEmail });
    if (existingCustomer) {
      console.error(`[Action: saveCustomer] Validation failed: Email ${normalizedEmail} already exists.`);
      return { success: false, error: 'An account with this email already exists. Please log in or use a different email.' };
    }

    const newCustomer: Customer = {
      id: uuidv4(),
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password.trim(), // Store plain text password (NOT FOR PRODUCTION)
      registeredAt: new Date(),
      lastLoginAt: undefined, 
    };

    console.log('[Action: saveCustomer] Attempting to insert new customer:', JSON.stringify(newCustomer));
    const result = await collection.insertOne(newCustomer);
    console.log('[Action: saveCustomer] MongoDB insert result:', JSON.stringify(result));

    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      if (insertedDoc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, password, ...customerWithoutSensitiveData } = insertedDoc; 
        console.log('[Action: saveCustomer] Successfully inserted and retrieved customer:', JSON.stringify(customerWithoutSensitiveData));
        return { success: true, data: customerWithoutSensitiveData as Omit<Customer, 'password' | '_id'> };
      }
      console.warn('[Action: saveCustomer] InsertedId was present, but document not found after insert. ID:', result.insertedId.toString());
      return { success: true, data: {id: newCustomer.id, name: newCustomer.name, email: newCustomer.email, registeredAt: newCustomer.registeredAt } };
    } else {
      console.error('[Action: saveCustomer] Failed to insert customer data. MongoDB result did not contain insertedId.');
      return { success: false, error: 'Failed to insert customer data.' };
    }
  } catch (error) {
    console.error('[Action: saveCustomer] Error during customer registration:', error);
    let errorMessage = 'An unknown error occurred while registering customer.';
    if (error instanceof Error) {
        errorMessage = error.message;
         if ((error as any).code === 11000) { 
            errorMessage = 'A duplicate record error occurred. This email might already be in use.';
        }
    }
    return { success: false, error: `Failed to register customer: ${errorMessage}` };
  }
}


export async function fetchAdminCustomers(): Promise<Omit<Customer, 'password' | '_id'>[]> {
  console.log('[Action: fetchAdminCustomers] Attempting to fetch customers for admin panel.');
  try {
    const collection = await getCustomersCollection();
    const customersCursor = collection.find({});
    const customersArray: WithId<Customer>[] = await customersCursor.toArray();
    console.log(`[Action: fetchAdminCustomers] Found ${customersArray.length} customers.`);
    
    return customersArray.map(c => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...customerData } = c;
      return customerData as Omit<Customer, 'password' | '_id'>;
    });
  } catch (error) {
    console.error('[Action: fetchAdminCustomers] Error fetching customers:', error);
    return [];
  }
}

async function fetchCustomerByEmailForAuth(email: string): Promise<Customer | null> {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`[Action: fetchCustomerByEmailForAuth] Attempting to fetch customer by email ${normalizedEmail}.`);
  try {
    const collection = await getCustomersCollection();
    const customerDoc = await collection.findOne({ email: normalizedEmail });
    if (customerDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...customer } = customerDoc; 
      return customer as Customer;
    }
    return null;
  } catch (error) {
    console.error(`[Action: fetchCustomerByEmailForAuth] Error fetching customer by email ${normalizedEmail}:`, error);
    return null;
  }
}

export async function loginCustomer(credentials: Pick<NewCustomerInput, 'email' | 'password'>): Promise<{ success: boolean; data?: Omit<Customer, 'password' | '_id'>; error?: string }> {
  console.log('[Action: loginCustomer] Attempting login for email:', credentials.email);
  try {
    const customer = await fetchCustomerByEmailForAuth(credentials.email);

    if (!customer) {
      console.log('[Action: loginCustomer] Customer not found for email:', credentials.email);
      return { success: false, error: 'Invalid email or password.' };
    }

    if (customer.password !== credentials.password.trim()) {
      console.log('[Action: loginCustomer] Password mismatch for email:', credentials.email);
      return { success: false, error: 'Invalid email or password.' };
    }

    const collection = await getCustomersCollection();
    const newLastLoginAt = new Date();
    await collection.updateOne({ id: customer.id }, { $set: { lastLoginAt: newLastLoginAt } });
    
    console.log('[Action: loginCustomer] Login successful for email:', credentials.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...customerDataToReturn } = customer;
    return { success: true, data: { ...customerDataToReturn, lastLoginAt: newLastLoginAt } as Omit<Customer, 'password' | '_id'> };

  } catch (error) {
    console.error('[Action: loginCustomer] Error during login:', error);
    let errorMessage = 'An unknown error occurred during login.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: `Login failed: ${errorMessage}` };
  }
}

// --- New Customer-Specific Actions ---

export async function fetchCustomerById(id: string): Promise<Omit<Customer, 'password' | '_id'> | null> {
  console.log(`[Action: fetchCustomerById] Attempting to fetch customer by ID ${id}.`);
  try {
    const collection = await getCustomersCollection();
    const customerDoc = await collection.findOne({ id: id }); // Using the UUID 'id' field
    if (customerDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...customerData } = customerDoc;
      return customerData as Omit<Customer, 'password' | '_id'>;
    }
    return null;
  } catch (error) {
    console.error(`[Action: fetchCustomerById] Error fetching customer by ID ${id}:`, error);
    return null;
  }
}

export async function updateCustomerProfile(id: string, data: { name?: string }): Promise<{ success: boolean; data?: Omit<Customer, 'password' | '_id'>; error?: string }> {
  console.log(`[Action: updateCustomerProfile] Updating profile for customer ID ${id} with data:`, data);
  try {
    if (!id || !data.name || data.name.trim() === "") {
      return { success: false, error: 'Customer ID and a valid name are required.' };
    }
    const collection = await getCustomersCollection();
    const result = await collection.findOneAndUpdate(
      { id: id },
      { $set: { name: data.name.trim() } },
      { returnDocument: 'after', projection: { password: 0, _id: 0 } }
    );

    if (result) {
      return { success: true, data: result as Omit<Customer, 'password' | '_id'> };
    } else {
      return { success: false, error: 'Customer not found or profile not updated.' };
    }
  } catch (error) {
    console.error(`[Action: updateCustomerProfile] Error updating profile for ${id}:`, error);
    return { success: false, error: 'Failed to update profile due to a server error.' };
  }
}

export async function changeCustomerPassword(customerId: string, currentPasswordInput: string, newPasswordInput: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action: changeCustomerPassword] Attempting to change password for customer ID ${customerId}.`);
  try {
    if (!customerId || !currentPasswordInput || !newPasswordInput) {
      return { success: false, error: 'Customer ID, current password, and new password are required.' };
    }
    if (newPasswordInput.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const collection = await getCustomersCollection();
    // Fetch the full customer document, including the password
    const customer = await collection.findOne({ id: customerId });

    if (!customer) {
      return { success: false, error: 'Customer not found.' };
    }

    // IMPORTANT: Plain text password comparison. NOT FOR PRODUCTION.
    if (customer.password !== currentPasswordInput.trim()) {
      return { success: false, error: 'Incorrect current password.' };
    }

    // Update the password (still plain text)
    const result = await collection.updateOne(
      { id: customerId },
      { $set: { password: newPasswordInput.trim() } }
    );

    if (result.modifiedCount === 1) {
      return { success: true };
    } else {
      return { success: false, error: 'Password not updated. Please try again.' };
    }
  } catch (error) {
    console.error(`[Action: changeCustomerPassword] Error changing password for ${customerId}:`, error);
    return { success: false, error: 'Failed to change password due to a server error.' };
  }
}

export async function fetchCustomerOrders(customerId: string): Promise<OrderRequest[]> {
  console.log(`[Action: fetchCustomerOrders] Fetching orders for customerId: ${customerId}`);
  try {
    const collection = await getOrderRequestsCollection();
    // Fetch orders where customerId matches
    const ordersCursor = collection.find({ customerId: customerId } as Filter<OrderRequest>);
    const ordersArray = await ordersCursor.sort({ requestedAt: -1 }).toArray();
    console.log(`[Action: fetchCustomerOrders] Found ${ordersArray.length} orders for customerId ${customerId}.`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ordersArray.map(({ _id, ...order }) => order as OrderRequest);
  } catch (error) {
    console.error(`[Action: fetchCustomerOrders] Error fetching orders for customerId ${customerId}:`, error);
    return [];
  }
}

export async function fetchCustomerInquiries(customerId: string): Promise<Inquiry[]> {
  console.log(`[Action: fetchCustomerInquiries] Fetching inquiries for customerId: ${customerId}`);
  try {
    const collection = await getInquiriesCollection();
    // Fetch inquiries where customerId matches
    const inquiriesCursor = collection.find({ customerId: customerId } as Filter<Inquiry>);
    const inquiriesArray = await inquiriesCursor.sort({ requestedAt: -1 }).toArray();
    console.log(`[Action: fetchCustomerInquiries] Found ${inquiriesArray.length} inquiries for customerId ${customerId}.`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return inquiriesArray.map(({ _id, ...inquiry }) => inquiry as Inquiry);
  } catch (error) {
    console.error(`[Action: fetchCustomerInquiries] Error fetching inquiries for customerId ${customerId}:`, error);
    return [];
  }
}
