// src/actions/customer-actions.ts
'use server';

import { getCustomersCollection } from '@/lib/mongodb';
import type { Customer, NewCustomerInput } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid';
import type { Collection } from 'mongodb';

// IMPORTANT: In a real application, passwords should be hashed before saving.
// For this simulation, we'll store it as plain text, but this is NOT secure for production.
// Consider using a library like bcrypt.js for hashing.

export async function saveCustomer(data: NewCustomerInput): Promise<{ success: boolean; data?: Customer; error?: string }> {
  console.log('[Action: saveCustomer] Received data for customer registration:', JSON.stringify(data));
  try {
    const collection: Collection<Customer> = await getCustomersCollection();

    if (!data.name || !data.email || !data.password) {
      console.error('[Action: saveCustomer] Validation failed: Name, email, and password are required.');
      return { success: false, error: 'Name, email, and password are required.' };
    }
    if (data.password.trim().length < 6) { // Basic password length check
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
    };

    console.log('[Action: saveCustomer] Attempting to insert new customer:', JSON.stringify(newCustomer));
    const result = await collection.insertOne(newCustomer);
    console.log('[Action: saveCustomer] MongoDB insert result:', JSON.stringify(result));

    if (result.insertedId) {
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      if (insertedDoc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, password, ...customerWithoutSensitiveData } = insertedDoc; // Exclude password from returned data
        console.log('[Action: saveCustomer] Successfully inserted and retrieved customer:', JSON.stringify(customerWithoutSensitiveData));
        return { success: true, data: customerWithoutSensitiveData as Customer };
      }
      console.warn('[Action: saveCustomer] InsertedId was present, but document not found after insert. ID:', result.insertedId.toString());
      return { success: true, data: undefined };
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


export async function fetchAdminCustomers(): Promise<Customer[]> {
  console.log('[Action: fetchAdminCustomers] Attempting to fetch customers for admin panel.');
  try {
    const collection = await getCustomersCollection();
    const customersCursor = collection.find({});
    const customersArray = await customersCursor.toArray();
    console.log(`[Action: fetchAdminCustomers] Found ${customersArray.length} customers.`);
    
    // Exclude password and MongoDB _id from the returned data
    return customersArray.map(c => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...customerData } = c;
      return customerData as Customer;
    });
  } catch (error) {
    console.error('[Action: fetchAdminCustomers] Error fetching customers:', error);
    return [];
  }
}

// Placeholder for fetching customer by email for login (if you build custom auth)
export async function fetchCustomerByEmailForLogin(email: string): Promise<Customer | null> {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`[Action: fetchCustomerByEmailForLogin] Attempting to fetch customer by email ${normalizedEmail}.`);
  try {
    const collection = await getCustomersCollection();
    const customerDoc = await collection.findOne({ email: normalizedEmail });
    if (customerDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...customer } = customerDoc; // Return with password for login check
      return customer as Customer;
    }
    return null;
  } catch (error) {
    console.error(`[Action: fetchCustomerByEmailForLogin] Error fetching customer by email ${normalizedEmail}:`, error);
    return null;
  }
}
