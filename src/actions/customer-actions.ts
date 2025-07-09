// src/actions/customer-actions.ts
'use server';

import { getCustomersCollection, getOrderRequestsCollection } from '@/lib/mongodb';
import type { Customer, NewCustomerInput, OrderRequest } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid';
import type { Collection, WithId, Filter } from 'mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId
import { logAuditEvent } from './audit-log-actions';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function saveCustomer(data: NewCustomerInput): Promise<{ success: boolean; message: string; error?: string }> {
  console.log('[Action: saveCustomer] Received data for customer registration:', JSON.stringify(data));
  try {
    const collection: Collection<Customer> = await getCustomersCollection();

    if (!data.name || !data.email || !data.password) {
      console.error('[Action: saveCustomer] Validation failed: Name, email, and password are required.');
      return { success: false, message: 'Name, email, and password are required.' };
    }
    if (data.password.trim().length < 6) { 
        console.error('[Action: saveCustomer] Validation failed: Password too short.');
        return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const normalizedEmail = data.email.toLowerCase().trim();

    const existingCustomer = await collection.findOne({ email: normalizedEmail });
    if (existingCustomer) {
      if (!existingCustomer.emailVerified) {
        // If user exists but is not verified, allow them to get a new verification email
        await resendVerificationEmail(normalizedEmail);
        return { success: true, message: `An unverified account with this email already exists. We've sent a new verification link to ${normalizedEmail}. Please check your inbox and spam folder.` };
      }
      console.error(`[Action: saveCustomer] Validation failed: Email ${normalizedEmail} already exists and is verified.`);
      return { success: false, message: 'An account with this email already exists. Please log in or use a different email.' };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(data.password.trim(), SALT_ROUNDS);

    const newCustomer: Omit<Customer, '_id'> = {
      id: uuidv4(),
      name: data.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      registeredAt: new Date(),
      lastLoginAt: undefined, 
      emailVerified: null,
      verificationToken: verificationToken,
    };

    console.log('[Action: saveCustomer] Attempting to insert new customer.');
    const result = await collection.insertOne(newCustomer);
    console.log('[Action: saveCustomer] MongoDB insert result:', result.insertedId);

    if (result.insertedId) {
      // Send verification email
      await sendVerificationEmail(newCustomer.email, verificationToken);

      logAuditEvent(
        'Customer account created (pending verification)',
        { type: 'customer', id: newCustomer.id },
        { name: newCustomer.name, email: newCustomer.email }
      );
      return { success: true, message: 'Account created successfully! A verification link has been sent to your email.' };
    } else {
      console.error('[Action: saveCustomer] Failed to insert customer data. MongoDB result did not contain insertedId.');
      return { success: false, message: 'Failed to insert customer data.' };
    }
  } catch (error) {
    console.error('[Action: saveCustomer] Error during customer registration:', error);
    let errorMessage = 'An unknown error occurred while registering customer.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: `Failed to register customer: ${errorMessage}` };
  }
}

export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Action: verifyEmail] Attempting to verify with token: ${token.substring(0, 10)}...`);
  if (!token) {
    return { success: false, message: 'Verification token is missing.' };
  }

  try {
    const collection = await getCustomersCollection();
    const customer = await collection.findOne({ verificationToken: token });

    if (!customer) {
      return { success: false, message: 'Invalid or expired verification token.' };
    }

    const result = await collection.updateOne(
      { _id: customer._id },
      { $set: { emailVerified: new Date() }, $unset: { verificationToken: "" } }
    );

    if (result.modifiedCount > 0) {
      logAuditEvent('Customer email verified', { type: 'customer', id: customer.id }, { email: customer.email });
      return { success: true, message: 'Email verified successfully! You can now log in.' };
    }
    
    return { success: false, message: 'Could not verify email. It may have already been verified.' };

  } catch (error) {
    console.error('[Action: verifyEmail] Error during email verification:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}

export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Action: resendVerificationEmail] Request for email: ${email}`);
  const genericSuccessMessage = "If an account with this email exists and is unverified, a new verification link has been sent. Please check your inbox and spam folder.";

  try {
    const collection = await getCustomersCollection();
    const customer = await collection.findOne({ email: email.toLowerCase().trim() });

    if (!customer || customer.emailVerified) {
      // Don't reveal if user exists or is already verified
      console.log(`[Action: resendVerificationEmail] No action needed for email: ${email}.`);
      return { success: true, message: genericSuccessMessage };
    }

    const newVerificationToken = crypto.randomBytes(32).toString('hex');
    await collection.updateOne(
      { _id: customer._id },
      { $set: { verificationToken: newVerificationToken } }
    );
    
    // Send the new verification email
    await sendVerificationEmail(customer.email, newVerificationToken);
    
    logAuditEvent('Resent verification email', { type: 'customer', id: customer.id }, { email: customer.email });
    return { success: true, message: genericSuccessMessage };

  } catch (error) {
    console.error('[Action: resendVerificationEmail] Error:', error);
    // Still return a generic message on failure to prevent leaking information
    return { success: true, message: genericSuccessMessage };
  }
}


export async function fetchAdminCustomers(): Promise<Omit<Customer, 'password' | '_id'>[]> {
  console.log('[Action: fetchAdminCustomers] Attempting to fetch customers for admin panel.');
  try {
    const collection = await getCustomersCollection();
    const customersCursor = collection.find({}).sort({ registeredAt: -1 });
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

export async function fetchLatestCustomers(limit: number = 3): Promise<Omit<Customer, 'password' | '_id'>[]> {
  console.log(`[Action: fetchLatestCustomers] Attempting to fetch latest ${limit} customers.`);
  try {
    const collection = await getCustomersCollection();
    const customersCursor = collection.find({}).sort({ registeredAt: -1 }).limit(limit);
    const customersArray: WithId<Customer>[] = await customersCursor.toArray();
    console.log(`[Action: fetchLatestCustomers] Found ${customersArray.length} customers.`);
    return customersArray.map(c => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...customerData } = c;
      return customerData as Omit<Customer, 'password' | '_id'>;
    });
  } catch (error) {
    console.error(`[Action: fetchLatestCustomers] Error fetching latest customers:`, error);
    return [];
  }
}

// --- New Customer-Specific Actions ---

export async function fetchCustomerById(id: string): Promise<Omit<Customer, 'password' | '_id'> | null> {
  console.log(`[Action: fetchCustomerById] Attempting to fetch customer by ID ${id}.`);
  try {
    const collection = await getCustomersCollection();
    
    // This query now handles both custom UUIDs (from credential signup) 
    // and MongoDB ObjectIDs (from OAuth providers like Google).
    const query = {
      $or: [
        { id: id },
        ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: 'invalid-object-id' }
      ]
    };
    
    const customerDoc = await collection.findOne(query);
    
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
    
    const filter = {
      $or: [
        { id: id },
        ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: 'invalid-object-id' }
      ]
    };

    const result = await collection.findOneAndUpdate(
      filter,
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
    
    const filter = {
      $or: [
        { id: customerId },
        ObjectId.isValid(customerId) ? { _id: new ObjectId(customerId) } : { id: 'invalid-object-id' }
      ]
    };
    
    const customer = await collection.findOne(filter);

    if (!customer) {
      return { success: false, error: 'Customer not found.' };
    }
    
    if (!customer.password) {
        return { success: false, error: 'Password cannot be changed for this account (e.g., social login).' };
    }

    const passwordMatch = await bcrypt.compare(currentPasswordInput.trim(), customer.password);
    if (!passwordMatch) {
      return { success: false, error: 'Incorrect current password.' };
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPasswordInput.trim(), SALT_ROUNDS);
    const result = await collection.updateOne(
      { _id: customer._id }, // Always update using the unique _id
      { $set: { password: newHashedPassword } }
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

export async function fetchOrderRequestById(orderId: string): Promise<OrderRequest | null> {
  console.log(`[Action: fetchOrderRequestById] Fetching order request by ID: ${orderId}`);
  try {
    const collection = await getOrderRequestsCollection();
    const orderDoc = await collection.findOne({ id: orderId });
    if (orderDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...orderData } = orderDoc;
      return orderData as OrderRequest;
    }
    return null;
  } catch (error) {
    console.error(`[Action: fetchOrderRequestById] Error fetching order request by ID ${orderId}:`, error);
    return null;
  }
}


// --- New Password Reset Actions ---

export async function requestCustomerPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Action: requestCustomerPasswordReset] Request received for email: ${email}`);
  const genericSuccessMessage = "If an account with this email exists and is not a social login, a password reset link has been sent. Please check your console for the link during development.";

  try {
    const collection = await getCustomersCollection();
    const customer = await collection.findOne({ email: email.toLowerCase().trim() });

    // Important security check: Don't allow password resets for accounts without a password (social logins)
    if (!customer || !customer.password) {
      console.log(`[Action: requestCustomerPasswordReset] No applicable customer found for email: ${email}. Sending generic success message to prevent enumeration.`);
      return { success: true, message: genericSuccessMessage };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await collection.updateOne(
      { _id: customer._id },
      { $set: { passwordResetToken: resetToken, passwordResetTokenExpires } }
    );
    
    // Simulate sending email by logging to console
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const resetUrl = `${baseUrl}/customer/reset-password?token=${resetToken}`;
    
    console.log("----------------------------------------------------");
    console.log("CUSTOMER PASSWORD RESET REQUESTED (FOR DEVELOPER TESTING)");
    console.log(`Customer: ${customer.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("----------------------------------------------------");
    
    logAuditEvent('Customer requested password reset', { type: 'customer', id: customer.id }, { email: customer.email });

    return { success: true, message: genericSuccessMessage };

  } catch (error) {
    console.error("[Action: requestCustomerPasswordReset] Error:", error);
    // Still return a generic message on failure to prevent leaking information
    return { success: true, message: genericSuccessMessage };
  }
}

export async function resetCustomerPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action: resetCustomerPasswordWithToken] Attempting to reset password with token: ${token.substring(0,10)}...`);

  try {
    if (!token || !newPassword) {
      return { success: false, error: 'Token and new password are required.' };
    }
    if (newPassword.trim().length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const collection = await getCustomersCollection();
    const customer = await collection.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() } // Check if token is not expired
    });

    if (!customer) {
      console.log(`[Action: resetCustomerPasswordWithToken] Invalid or expired token provided.`);
      return { success: false, error: 'This password reset token is invalid or has expired.' };
    }

    // Hash the new password before storing it
    const newHashedPassword = await bcrypt.hash(newPassword.trim(), SALT_ROUNDS);
    
    // Update the password and clear the reset token fields
    const result = await collection.updateOne(
      { _id: customer._id },
      {
        $set: { password: newHashedPassword },
        $unset: { passwordResetToken: "", passwordResetTokenExpires: "" }
      }
    );

    if (result.modifiedCount === 1) {
      console.log(`[Action: resetCustomerPasswordWithToken] Successfully reset password for ${customer.email}.`);
      logAuditEvent('Customer password successfully reset via token', { type: 'customer', id: customer.id }, { email: customer.email });
      return { success: true };
    } else {
      return { success: false, error: 'Failed to update password. Please try again.' };
    }

  } catch (error) {
    console.error('[Action: resetCustomerPasswordWithToken] Error:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}
