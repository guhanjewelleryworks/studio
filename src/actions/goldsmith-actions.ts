
// src/actions/goldsmith-actions.ts
'use server';

import { getGoldsmithsCollection, getOrderRequestsCollection } from '@/lib/mongodb';
import type { Goldsmith, NewGoldsmithInput, OrderRequest, NewOrderRequestInput, OrderRequestStatus } from '@/types/goldsmith';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import type { Collection, Filter, WithId, FindOneAndUpdateOptions } from 'mongodb';
import { logAuditEvent } from './audit-log-actions';
import { createAdminNotification } from './notification-actions';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

export async function saveGoldsmith(data: NewGoldsmithInput): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  console.log('[Action: saveGoldsmith] Received data for registration:', JSON.stringify(data));
  try {
    const collection: Collection<Goldsmith> = await getGoldsmithsCollection();

    // Basic validation
    if (!data.name || !data.email || !data.password || !data.state || !data.district || !data.contactPerson || !data.phone || !data.specialty || (Array.isArray(data.specialty) && data.specialty.length === 0)) {
        console.error('[Action: saveGoldsmith] Validation failed: All required fields must be filled.');
        return { success: false, error: 'Please fill out all required fields: Workshop Name, Contact Person, Email, Phone, Location, and Specialties.' };
    }
    // Password length validation
    if (data.password.trim().length < 8) {
        console.error('[Action: saveGoldsmith] Validation failed: Password too short.');
        return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const normalizedEmail = data.email.toLowerCase().trim();
    const normalizedPhone = data.phone ? data.phone.trim() : undefined; 

    if (normalizedPhone && normalizedPhone.length !== 10) {
        console.error(`[Action: saveGoldsmith] Validation failed: Phone number ${normalizedPhone} is not 10 digits.`);
        return { success: false, error: 'Phone number must be exactly 10 digits.' };
    }


    const existingGoldsmithByEmail = await collection.findOne({ email: normalizedEmail });
    if (existingGoldsmithByEmail) {
        console.error(`[Action: saveGoldsmith] Validation failed: Email ${normalizedEmail} already exists.`);
        return { success: false, error: 'An account with this email already exists. Please use a different email or log in.' };
    }

    if (normalizedPhone && normalizedPhone !== '') {
        const existingGoldsmithByPhone = await collection.findOne({ phone: normalizedPhone });
        if (existingGoldsmithByPhone) {
            console.error(`[Action: saveGoldsmith] Validation failed: Phone number ${normalizedPhone} already exists.`);
            return { success: false, error: 'An account with this phone number already exists. Please use a different phone number.' };
        }
    }

    const safeNameSeed = (data.name && data.name.trim() !== "")
      ? data.name.trim().replace(/\s+/g, '-').toLowerCase()
      : `goldsmith-${uuidv4().substring(0, 8)}`;

    const workshopNameOrDefault = data.name && data.name.trim() !== "" ? data.name.trim() : "Artisan";

    const specialtyText = (Array.isArray(data.specialty) && data.specialty.length > 0)
        ? data.specialty.join(', ')
        : 'fine jewelry';
    
    const hashedPassword = await bcrypt.hash(data.password.trim(), SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newGoldsmith: Goldsmith = {
      name: data.name.trim(),
      contactPerson: data.contactPerson?.trim() || '',
      email: normalizedEmail,
      phone: normalizedPhone || '', 
      state: data.state,
      district: data.district,
      specialty: Array.isArray(data.specialty) ? data.specialty.map(s => s.trim()).filter(s => s) : (data.specialty?.toString().trim() || ''),
      portfolioLink: data.portfolioLink?.trim() || '',
      password: hashedPassword, 
      id: uuidv4(),
      rating: 0,
      imageUrl: `https://picsum.photos/seed/${safeNameSeed}/400/300`,
      profileImageUrl: `https://picsum.photos/seed/${safeNameSeed}-profile/120/120`,
      location: defaultLocation,
      shortBio: `Specializing in ${specialtyText}. Based in ${data.district}, ${data.state}.`,
      tagline: `Bespoke creations by ${workshopNameOrDefault}`,
      bio: `Discover the craftsmanship of ${workshopNameOrDefault}. This artisan brings years of dedication and a passion for unique jewelry to every piece, ensuring meticulous attention to detail and a personal touch. From initial design to final polish, experience the art of bespoke jewelry.`,
      yearsExperience: data.yearsExperience || 0,
      responseTime: data.responseTime || "Varies",
      ordersCompleted: 0,
      profileViews: 0,
      status: 'pending_email_verification',
      registeredAt: new Date(),
      emailVerified: null,
      verificationToken,
    };
    
    console.log('[Action: saveGoldsmith] Attempting to insert new goldsmith...');
    const result = await collection.insertOne(newGoldsmith);
    console.log('[Action: saveGoldsmith] MongoDB insert result:', JSON.stringify(result));

    if (result.insertedId) {
      logAuditEvent(
        'Goldsmith account created (pending email verification)',
        { type: 'goldsmith', id: newGoldsmith.id },
        { name: newGoldsmith.name, email: newGoldsmith.email }
      );

      // Send verification email
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/goldsmith-portal/verify-email?token=${verificationToken}`;
      await sendVerificationEmail(newGoldsmith.email, verificationUrl);
      
      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      if (insertedDoc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...goldsmithWithoutMongoId } = insertedDoc;
        console.log('[Action: saveGoldsmith] Successfully inserted and retrieved doc.');
        return { success: true, data: goldsmithWithoutMongoId as Goldsmith };
      }
      console.warn('[Action: saveGoldsmith] InsertedId was present, but document not found immediately after insert. ID:', result.insertedId.toString());
      return { success: true, data: undefined }; 
    } else {
      console.error('[Action: saveGoldsmith] Failed to insert goldsmith data. MongoDB result did not contain insertedId.');
      return { success: false, error: 'Failed to insert goldsmith data.' };
    }
  } catch (error) {
    console.error('[Action: saveGoldsmith] Error during goldsmith registration:', error);
    let errorMessage = 'An unknown error occurred while registering goldsmith.';
    if (error instanceof Error) {
        errorMessage = error.message;
         if ((error as any).code === 11000) { 
            errorMessage = 'A duplicate record error occurred. This email or phone number might already be in use.';
        }
    }
    return { success: false, error: `Failed to register goldsmith: ${errorMessage}` };
  }
}

export async function verifyGoldsmithEmail(token: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Action: verifyGoldsmithEmail] Attempting to verify with token: ${token.substring(0, 10)}...`);
  if (!token) {
    return { success: false, message: 'Verification token is missing.' };
  }

  try {
    const collection = await getGoldsmithsCollection();
    const goldsmith = await collection.findOne({ verificationToken: token });

    if (!goldsmith) {
      return { success: false, message: 'Invalid or expired verification token.' };
    }

    const result = await collection.updateOne(
      { _id: goldsmith._id },
      { $set: { emailVerified: new Date(), status: 'pending_verification' }, $unset: { verificationToken: "" } }
    );

    if (result.modifiedCount > 0) {
      logAuditEvent('Goldsmith email verified', { type: 'goldsmith', id: goldsmith.id }, { email: goldsmith.email });

      // Notify admin now that email is verified
      await createAdminNotification({
        type: 'new_goldsmith_registration',
        message: `New goldsmith '${goldsmith.name}' has verified their email and is awaiting approval.`,
        link: '/admin/goldsmiths',
      });
      
      return { success: true, message: 'Email verified successfully! Your profile is now under review by our administrators.' };
    }
    
    return { success: false, message: 'Could not verify email. It may have already been verified.' };

  } catch (error) {
    console.error('[Action: verifyGoldsmithEmail] Error during email verification:', error);
    return { success: false, message: 'An unexpected server error occurred.' };
  }
}

export async function fetchAllGoldsmiths(): Promise<Goldsmith[]> {
  console.log('[Action: fetchAllGoldsmiths] Attempting to fetch verified goldsmiths for discover page.');
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithsCursor = collection.find({ status: 'verified' } as Filter<Goldsmith>); 
    const goldsmithsArray = await goldsmithsCursor.toArray();
    console.log(`[Action: fetchAllGoldsmiths] Found ${goldsmithsArray.length} verified goldsmiths.`);
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; 
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error('[Action: fetchAllGoldsmiths] Error fetching all verified goldsmiths:', error);
    return [];
  }
}

export async function fetchAdminGoldsmiths(): Promise<Goldsmith[]> {
  console.log('[AdminActions] Fetching all goldsmiths for admin panel.');
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithsCursor = collection.find({}).sort({ registeredAt: -1 });
    const goldsmithsArray = await goldsmithsCursor.toArray();
    console.log(`[AdminActions] Found ${goldsmithsArray.length} total goldsmiths for admin panel.`);
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g; 
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error("[AdminActions] Error fetching all goldsmiths for admin:", error);
    return [];
  }
}

export async function fetchLatestGoldsmiths(limit: number = 5): Promise<Goldsmith[]> {
  console.log(`[Action: fetchLatestGoldsmiths] Attempting to fetch latest ${limit} goldsmiths.`);
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithsCursor = collection.find({}).sort({ registeredAt: -1 }).limit(limit);
    const goldsmithsArray: WithId<Goldsmith>[] = await goldsmithsCursor.toArray();
    console.log(`[Action: fetchLatestGoldsmiths] Found ${goldsmithsArray.length} goldsmiths.`);
    return goldsmithsArray.map(g => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...rest } = g;
      return rest as Goldsmith;
    });
  } catch (error) {
    console.error(`[Action: fetchLatestGoldsmiths] Error fetching latest goldsmiths:`, error);
    return [];
  }
}


export async function updateGoldsmithStatus(id: string, newStatus: Goldsmith['status']): Promise<{ success: boolean; error?: string }> {
  console.log(`[AdminActions] Updating status for goldsmith ID ${id} to ${newStatus}.`);
  try {
    if (!id || !newStatus) {
      return { success: false, error: 'Goldsmith ID and new status are required.' };
    }
    const validStatuses: Goldsmith['status'][] = ['pending_email_verification', 'pending_verification', 'verified', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status provided.' };
    }

    const collection = await getGoldsmithsCollection();
    const result = await collection.updateOne(
      { id: id },
      { $set: { status: newStatus } }
    );

    if (result.modifiedCount === 1) {
      logAuditEvent(
        `Updated goldsmith status to "${newStatus}"`,
        { type: 'admin', id: 'admin_user' }, // Assuming admin action for now
        { goldsmithId: id, newStatus }
      );
      return { success: true };
    } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
      return { success: true, error: 'Goldsmith status is already set to the new status.' };
    } else {
      return { success: false, error: 'Goldsmith not found or status not updated.' };
    }
  } catch (error) {
    console.error(`[AdminActions] Error updating status for ${id}:`, error);
    return { success: false, error: 'Failed to update status due to a server error.' };
  }
}


export async function fetchGoldsmithById(id: string): Promise<Goldsmith | null> {
  console.log(`[Action: fetchGoldsmithById] Attempting to fetch goldsmith by ID ${id}.`);
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ id: id }); 
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, password, ...goldsmith } = goldsmithDoc; 
      console.log(`[Action: fetchGoldsmithById] Found goldsmith.`);
      return goldsmith as Goldsmith;
    }
    console.log(`[Action: fetchGoldsmithById] Goldsmith with ID ${id} not found.`);
    return null;
  } catch (error) {
    console.error(`[Action: fetchGoldsmithById] Error fetching goldsmith by id ${id}:`, error);
    return null;
  }
}

export async function fetchGoldsmithByEmailForLogin(email: string): Promise<Goldsmith | null> {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`[Action: fetchGoldsmithByEmailForLogin] Attempting to fetch goldsmith by email ${normalizedEmail}.`);
  try {
    const collection = await getGoldsmithsCollection();
    const goldsmithDoc = await collection.findOne({ email: normalizedEmail }); 
    if (goldsmithDoc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmith } = goldsmithDoc;
      console.log(`[Action: fetchGoldsmithByEmailForLogin] Found goldsmith with matching email.`);
      return goldsmith as Goldsmith; 
    }
    console.log(`[Action: fetchGoldsmithByEmailForLogin] Goldsmith with email ${normalizedEmail} not found.`);
    return null;
  } catch (error) {
    console.error(`[Action: fetchGoldsmithByEmailForLogin] Error fetching goldsmith by email ${normalizedEmail} for login:`, error);
    return null;
  }
}

export async function loginGoldsmith(credentials: Pick<NewGoldsmithInput, 'email' | 'password'>): Promise<{ success: boolean; data?: Omit<Goldsmith, 'password' | '_id'>; error?: string }> {
  console.log('[Action: loginGoldsmith] Attempting login for email:', credentials.email);
  try {
    const goldsmith = await fetchGoldsmithByEmailForLogin(credentials.email);

    if (!goldsmith || !goldsmith.password) {
      console.log('[Action: loginGoldsmith] Goldsmith not found or no password set for email:', credentials.email);
      return { success: false, error: 'Invalid email or password.' };
    }

    if (!goldsmith.emailVerified) {
      return { success: false, error: 'Your email address has not been verified.' };
    }
    
    if (goldsmith.status !== 'verified') {
        let statusMessage = 'Your account is not yet active.';
        if (goldsmith.status === 'pending_verification') {
            statusMessage = 'Your account is pending administrator approval.';
        } else if (goldsmith.status === 'rejected') {
            statusMessage = 'Your account application was not approved. Please contact support for more information.';
        }
        return { success: false, error: statusMessage };
    }
    
    const passwordMatch = await bcrypt.compare(credentials.password.trim(), goldsmith.password);

    if (!passwordMatch) {
      console.log('[Action: loginGoldsmith] Password mismatch for email:', credentials.email);
      return { success: false, error: 'Invalid email or password.' };
    }

    const collection = await getGoldsmithsCollection();
    const newLastLoginAt = new Date();
    await collection.updateOne({ id: goldsmith.id }, { $set: { lastLoginAt: newLastLoginAt } });
    
    logAuditEvent(
      'Goldsmith successful login',
      { type: 'goldsmith', id: goldsmith.id },
      { email: goldsmith.email }
    );
    
    console.log('[Action: loginGoldsmith] Login successful for email:', credentials.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...goldsmithDataToReturn } = goldsmith;
    return { success: true, data: { ...goldsmithDataToReturn, lastLoginAt: newLastLoginAt } as Omit<Goldsmith, 'password' | '_id'> };

  } catch (error) {
    console.error('[Action: loginGoldsmith] Error during login:', error);
    let errorMessage = 'An unknown error occurred during login.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: `Login failed: ${errorMessage}` };
  }
}

// --- New Actions for Orders ---

export async function saveOrderRequest(data: NewOrderRequestInput): Promise<{ success: boolean; error?: string; data?: OrderRequest }> {
  console.log('[Action: saveOrderRequest] Received data:', JSON.stringify(data));
  try {
    // --- SERVER-SIDE VALIDATION ---
    if (!data.customerId || !data.customerName || !data.customerEmail) {
        console.error('[Action: saveOrderRequest] Validation failed: Customer ID, name, and email are required.');
        return { success: false, error: 'A logged-in customer is required to place an order.' };
    }
    if (!data.goldsmithId) {
        console.error('[Action: saveOrderRequest] Validation failed: Goldsmith ID is required.');
        return { success: false, error: 'A goldsmith must be specified for the order.' };
    }
    if (!data.details || !data.referenceImage || !data.customerPhone) {
        console.error('[Action: saveOrderRequest] Validation failed: Details, reference image, and phone number are required.');
        return { success: false, error: 'Order details, a reference image, and a phone number are required.' };
    }
    // --- END VALIDATION ---

    const collection = await getOrderRequestsCollection();
    const newOrderRequest: OrderRequest = {
      ...data,
      id: uuidv4(),
      status: 'new',
      requestedAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(newOrderRequest);
    if (result.insertedId) {
      // Create an admin notification for the new order request
      await createAdminNotification({
        type: 'new_order_request',
        message: `New order from '${newOrderRequest.customerName}' for '${newOrderRequest.itemDescription.substring(0, 25)}...'`,
        link: `/admin/orders/${newOrderRequest.id}`,
      });

      const insertedDoc = await collection.findOne({ _id: result.insertedId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...orderRequestWithoutMongoId } = insertedDoc!;
      return { success: true, data: orderRequestWithoutMongoId as OrderRequest };
    }
    return { success: false, error: 'Failed to save order request.' };
  } catch (error) {
    console.error('[Action: saveOrderRequest] Error:', error);
    return { success: false, error: 'Server error while saving order request.' };
  }
}

export async function getNewOrderCountForGoldsmith(goldsmithId: string): Promise<number> {
  console.log(`[Action: getNewOrderCountForGoldsmith] Fetching for goldsmithId: ${goldsmithId}`);
  try {
    const collection = await getOrderRequestsCollection();
    const count = await collection.countDocuments({ goldsmithId, status: 'pending_goldsmith_review' });
    console.log(`[Action: getNewOrderCountForGoldsmith] Found ${count} new orders for review.`);
    return count;
  } catch (error) {
    console.error(`[Action: getNewOrderCountForGoldsmith] Error fetching new order count for ${goldsmithId}:`, error);
    return 0;
  }
}

// --- New Actions for Admin Dashboard Stats ---
export async function getPlatformPendingOrderCount(): Promise<number> {
  console.log('[Action: getPlatformPendingOrderCount] Fetching count of pending orders for admin dashboard.');
  try {
    const collection = await getOrderRequestsCollection();
    const pendingStatuses: OrderRequestStatus[] = ['new', 'pending_goldsmith_review'];
    const count = await collection.countDocuments({ status: { $in: pendingStatuses } });
    console.log(`[Action: getPlatformPendingOrderCount] Found ${count} pending orders.`);
    return count;
  } catch (error) {
    console.error(`[Action: getPlatformPendingOrderCount] Error fetching pending order count:`, error);
    return 0;
  }
}

// --- Actions for Admin Dashboard Recent Activity ---
export async function fetchLatestPlatformOrderRequests(limit: number = 3): Promise<OrderRequest[]> {
  console.log(`[Action: fetchLatestPlatformOrderRequests] Fetching latest ${limit} platform order requests.`);
  try {
    const collection = await getOrderRequestsCollection();
    const ordersCursor = collection.find({}).sort({ requestedAt: -1 }).limit(limit);
    const ordersArray: WithId<OrderRequest>[] = await ordersCursor.toArray();
    console.log(`[Action: fetchLatestPlatformOrderRequests] Found ${ordersArray.length} orders.`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ordersArray.map(({ _id, ...order }) => order as OrderRequest);
  } catch (error) {
    console.error(`[Action: fetchLatestPlatformOrderRequests] Error fetching latest orders:`, error);
    return [];
  }
}

export async function fetchAllPlatformOrderRequests(): Promise<OrderRequest[]> {
  console.log(`[Action: fetchAllPlatformOrderRequests] Fetching all platform order requests for admin.`);
  try {
    const collection = await getOrderRequestsCollection();
    const ordersCursor = collection.find({}).sort({ requestedAt: -1 }); // Sort by most recent
    const ordersArray: WithId<OrderRequest>[] = await ordersCursor.toArray();
    console.log(`[Action: fetchAllPlatformOrderRequests] Found ${ordersArray.length} total orders.`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ordersArray.map(({ _id, ...order }) => order as OrderRequest);
  } catch (error) {
    console.error(`[Action: fetchAllPlatformOrderRequests] Error fetching all orders:`, error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderRequestStatus
): Promise<{ success: boolean; error?: string; data?: OrderRequest }> {
  console.log(`[Action: updateOrderStatus] Updating order ${orderId} to status ${newStatus}`);
  try {
    if (!orderId || !newStatus) {
      return { success: false, error: 'Order ID and new status are required.' };
    }

    const validStatuses: OrderRequestStatus[] = [
      'new', 'pending_goldsmith_review', 'in_progress', 
      'artwork_completed', 'customer_review_requested', 'shipped', 
      'completed', 'cancelled'
    ];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: `Invalid order status: ${newStatus}` };
    }

    const collection = await getOrderRequestsCollection();
    const filter = { id: orderId };
    const updateDoc = {
      $set: {
        status: newStatus,
        updatedAt: new Date(),
      },
    };
    const options: FindOneAndUpdateOptions = {
      returnDocument: 'after',
      projection: { _id: 0 } as any,
    };

    const result = await collection.findOneAndUpdate(filter, updateDoc, options);
    
    if (result) {
        const orderData = result as OrderRequest;
        console.log(`[Action: updateOrderStatus] Successfully updated order ${orderId} to ${newStatus}.`);

        logAuditEvent(
            `Updated order status to "${newStatus}"`,
            { type: 'admin', id: 'system_or_user' }, 
            { orderId, newStatus }
        );
        
        // Notify admin about the status change
        await createAdminNotification({
            type: 'order_status_update',
            message: `Order #${orderId.substring(0, 8)} status updated to "${newStatus.replace(/_/g, ' ')}" for customer ${orderData.customerName}.`,
            link: `/admin/orders/${orderId}`,
        });

        return { success: true, data: orderData };
    } else {
        console.log(`[Action: updateOrderStatus] Order ${orderId} not found or not updated.`);
        return { success: false, error: 'Order not found or status not updated.' };
    }
  } catch (error) {
    console.error(`[Action: updateOrderStatus] Error updating order status for ${orderId}:`, error);
    let errorMessage = 'An unknown error occurred while updating order status.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: `Failed to update order status: ${errorMessage}` };
  }
}


export async function updateGoldsmithProfile(
  id: string, 
  data: Partial<Pick<Goldsmith, 'name' | 'contactPerson' | 'phone' | 'state' | 'district' | 'specialty' | 'portfolioLink' | 'bio' | 'tagline' | 'yearsExperience' | 'responseTime'>>
): Promise<{ success: boolean; data?: Goldsmith; error?: string }> {
  console.log(`[Action: updateGoldsmithProfile] Updating profile for goldsmith ID ${id} with data:`, data);
  try {
    if (!id) {
      return { success: false, error: 'Goldsmith ID is required.' };
    }

    const collection = await getGoldsmithsCollection();

    // Sanitize and prepare the update object
    const updateData: { [key: string]: any } = {};
    if (data.name && data.name.trim()) updateData.name = data.name.trim();
    if (data.contactPerson && data.contactPerson.trim()) updateData.contactPerson = data.contactPerson.trim();
    if (data.state && data.state.trim()) updateData.state = data.state.trim();
    if (data.district && data.district.trim()) updateData.district = data.district.trim();
    if (data.specialty) { // specialty can be string or string[]
        if (Array.isArray(data.specialty)) {
            updateData.specialty = data.specialty.map(s => s.trim()).filter(s => s);
        } else if (typeof data.specialty === 'string') {
            updateData.specialty = data.specialty.split(',').map(s => s.trim()).filter(s => s);
        }
    }
    if (data.portfolioLink) updateData.portfolioLink = data.portfolioLink.trim();
    if (data.bio) updateData.bio = data.bio.trim();
    if (data.tagline) updateData.tagline = data.tagline.trim();
    if (data.yearsExperience !== undefined) updateData.yearsExperience = data.yearsExperience;
    if (data.responseTime) updateData.responseTime = data.responseTime.trim();
    
    // Server-side validation for phone number
    if (data.phone !== undefined) {
      const trimmedPhone = data.phone.trim();
      if (!trimmedPhone) {
        return { success: false, error: "Phone number is required and cannot be empty." };
      }
      if (trimmedPhone.length !== 10) {
        return { success: false, error: "Phone number must be exactly 10 digits." };
      }
      // Check for uniqueness, excluding the current user
      const existingGoldsmith = await collection.findOne({ phone: trimmedPhone, id: { $ne: id } });
      if (existingGoldsmith) {
        return { success: false, error: "This phone number is already in use by another account." };
      }
      updateData.phone = trimmedPhone;
    }

    if (Object.keys(updateData).length === 0) {
        return { success: false, error: "No valid data provided to update." };
    }


    const result = await collection.findOneAndUpdate(
      { id: id },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } } // Exclude password from result
    );

    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmithData } = result;
      return { success: true, data: goldsmithData as Goldsmith };
    } else {
      return { success: false, error: 'Goldsmith not found or profile not updated.' };
    }
  } catch (error) {
    console.error(`[Action: updateGoldsmithProfile] Error updating profile for ${id}:`, error);
    return { success: false, error: 'Failed to update profile due to a server error.' };
  }
}

// --- New Actions for Portfolio Management ---

const MAX_PORTFOLIO_IMAGES = 8;

export async function addGoldsmithPortfolioImage(
  goldsmithId: string, 
  imageDataUri: string
): Promise<{ success: boolean; error?: string; data?: Goldsmith }> {
  console.log(`[Action: addGoldsmithPortfolioImage] Adding image for goldsmith ID ${goldsmithId}`);
  try {
    if (!goldsmithId || !imageDataUri) {
      return { success: false, error: 'Goldsmith ID and image data are required.' };
    }

    const collection = await getGoldsmithsCollection();

    // First, check the current image count to enforce the limit
    const goldsmith = await collection.findOne({ id: goldsmithId });
    if (!goldsmith) {
        return { success: false, error: 'Goldsmith not found.' };
    }
    if (goldsmith.portfolioImages && goldsmith.portfolioImages.length >= MAX_PORTFOLIO_IMAGES) {
        return { success: false, error: `Portfolio is full. You cannot upload more than ${MAX_PORTFOLIO_IMAGES} images.` };
    }


    const result = await collection.findOneAndUpdate(
      { id: goldsmithId },
      { $push: { portfolioImages: imageDataUri } },
      { returnDocument: 'after', projection: { password: 0 } } // Exclude password from result
    );

    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmithData } = result;
      return { success: true, data: goldsmithData as Goldsmith };
    } else {
      return { success: false, error: 'Goldsmith not found or image not added.' };
    }
  } catch (error) {
    console.error(`[Action: addGoldsmithPortfolioImage] Error adding image for ${goldsmithId}:`, error);
    return { success: false, error: 'Failed to add image due to a server error.' };
  }
}

export async function deleteGoldsmithPortfolioImage(
  goldsmithId: string, 
  imageUrlToDelete: string
): Promise<{ success: boolean; error?: string; data?: Goldsmith }> {
  console.log(`[Action: deleteGoldsmithPortfolioImage] Deleting image for goldsmith ID ${goldsmithId}`);
  try {
    if (!goldsmithId || !imageUrlToDelete) {
      return { success: false, error: 'Goldsmith ID and image URL are required.' };
    }

    const collection = await getGoldsmithsCollection();
    const result = await collection.findOneAndUpdate(
      { id: goldsmithId },
      { $pull: { portfolioImages: imageUrlToDelete } },
      { returnDocument: 'after', projection: { password: 0 } } // Exclude password from result
    );

     if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmithData } = result;
      return { success: true, data: goldsmithData as Goldsmith };
    } else {
      return { success: false, error: 'Goldsmith not found or image not deleted.' };
    }
  } catch (error) {
    console.error(`[Action: deleteGoldsmithPortfolioImage] Error deleting image for ${goldsmithId}:`, error);
    return { success: false, error: 'Failed to delete image due to a server error.' };
  }
}

export async function fetchOrdersForGoldsmith(goldsmithId: string, status?: OrderRequestStatus | 'all'): Promise<OrderRequest[]> {
  console.log(`[Action: fetchOrdersForGoldsmith] Fetching orders for goldsmithId: ${goldsmithId} with status: ${status}`);
  try {
    if (!goldsmithId) {
        console.error('[Action: fetchOrdersForGoldsmith] Goldsmith ID is required.');
        return [];
    }
    const collection = await getOrderRequestsCollection();
    
    const filter: Filter<OrderRequest> = { goldsmithId: goldsmithId };

    // Security rule: Goldsmiths should NEVER see orders with 'new' status. This is for admin review only.
    const securityFilter = { status: { $ne: 'new' as OrderRequestStatus } };

    if (status && status !== 'all') {
      // If a specific status is requested, combine it with the security rule.
      filter.$and = [
        securityFilter,
        { status: status }
      ];
    } else {
      // If 'all' or no status is requested, just apply the security rule.
      filter.status = securityFilter.status;
    }
    
    const ordersCursor = collection.find(filter);
    const ordersArray = await ordersCursor.sort({ requestedAt: -1 }).toArray();
    
    console.log(`[Action: fetchOrdersForGoldsmith] Found ${ordersArray.length} orders for goldsmithId ${goldsmithId}.`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ordersArray.map(({ _id, ...order }) => order as OrderRequest);
  } catch (error) {
    console.error(`[Action: fetchOrdersForGoldsmith] Error fetching orders for goldsmithId ${goldsmithId}:`, error);
    return [];
  }
}

export async function updateGoldsmithProfileImage(
  goldsmithId: string,
  profileImageDataUri: string
): Promise<{ success: boolean; error?: string; data?: Goldsmith }> {
  console.log(`[Action: updateGoldsmithProfileImage] Updating profile image for goldsmith ID ${goldsmithId}`);
  try {
    if (!goldsmithId || !profileImageDataUri) {
      return { success: false, error: 'Goldsmith ID and image data are required.' };
    }

    const collection = await getGoldsmithsCollection();
    const result = await collection.findOneAndUpdate(
      { id: goldsmithId },
      { $set: { profileImageUrl: profileImageDataUri } },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...goldsmithData } = result;
      return { success: true, data: goldsmithData as Goldsmith };
    } else {
      return { success: false, error: 'Goldsmith not found or profile image not updated.' };
    }
  } catch (error) {
    console.error(`[Action: updateGoldsmithProfileImage] Error updating image for ${goldsmithId}:`, error);
    return { success: false, error: 'Failed to update profile image due to a server error.' };
  }
}

export async function incrementProfileView(goldsmithId: string): Promise<void> {
  console.log(`[Action: incrementProfileView] Attempting to increment view for goldsmith ${goldsmithId}`);
  try {
    // This is a fire-and-forget operation from the client, so no return value is needed.
    const collection = await getGoldsmithsCollection();
    await collection.updateOne({ id: goldsmithId }, { $inc: { profileViews: 1 } });
  } catch (error) {
    // We log the error but don't re-throw it, as failing to track a view
    // shouldn't crash the profile page view for the user.
    console.error(`[Action: incrementProfileView] Failed to increment view count for ${goldsmithId}:`, error);
  }
}

export async function changeGoldsmithPassword(goldsmithId: string, currentPasswordInput: string, newPasswordInput: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action: changeGoldsmithPassword] Attempting to change password for goldsmith ID ${goldsmithId}.`);
  try {
    if (!goldsmithId || !currentPasswordInput || !newPasswordInput) {
      return { success: false, error: 'Goldsmith ID, current password, and new password are required.' };
    }
    if (newPasswordInput.trim().length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    const collection = await getGoldsmithsCollection();
    // Fetch the full goldsmith document, including the password
    const goldsmith = await collection.findOne({ id: goldsmithId });

    if (!goldsmith || !goldsmith.password) {
      return { success: false, error: 'Goldsmith not found or no password is set.' };
    }
    
    const passwordMatch = await bcrypt.compare(currentPasswordInput.trim(), goldsmith.password);
    if (!passwordMatch) {
      return { success: false, error: 'Incorrect current password.' };
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPasswordInput.trim(), SALT_ROUNDS);
    const result = await collection.updateOne(
      { id: goldsmithId },
      { $set: { password: newHashedPassword } }
    );

    if (result.modifiedCount === 1) {
      logAuditEvent('Goldsmith changed password', { type: 'goldsmith', id: goldsmithId }, { email: goldsmith.email });
      return { success: true };
    } else {
      return { success: false, error: 'Password not updated. Please try again.' };
    }
  } catch (error) {
    console.error(`[Action: changeGoldsmithPassword] Error changing password for ${goldsmithId}:`, error);
    return { success: false, error: 'Failed to change password due to a server error.' };
  }
}

// --- New Actions for Password Reset ---

export async function requestGoldsmithPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Action: requestGoldsmithPasswordReset] Request received for email: ${email}`);
  const genericSuccessMessage = "If an account with this email exists, a password reset link has been (simulated) sent.";

  try {
    const collection = await getGoldsmithsCollection();
    const goldsmith = await collection.findOne({ email: email.toLowerCase().trim() });

    if (!goldsmith) {
      console.log(`[Action: requestGoldsmithPasswordReset] No goldsmith found with email: ${email}. Sending generic success to prevent enumeration.`);
      return { success: true, message: genericSuccessMessage };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await collection.updateOne(
      { _id: goldsmith._id },
      { $set: { passwordResetToken: resetToken, passwordResetTokenExpires } }
    );
    
    // Use the public URL from env vars, falling back to the standard dev port
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const resetUrl = `${baseUrl}/goldsmith-portal/reset-password?token=${resetToken}`;
    
    console.log("----------------------------------------------------");
    console.log("PASSWORD RESET REQUESTED (FOR DEVELOPER TESTING)");
    console.log(`Goldsmith: ${goldsmith.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("----------------------------------------------------");
    
    logAuditEvent('Goldsmith requested password reset', { type: 'goldsmith', id: goldsmith.id }, { email: goldsmith.email });

    return { success: true, message: genericSuccessMessage };

  } catch (error) {
    console.error("[Action: requestGoldsmithPasswordReset] Error:", error);
    // Still return a generic message on failure to prevent leaking information
    return { success: true, message: genericSuccessMessage };
  }
}

export async function resetGoldsmithPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[Action: resetGoldsmithPasswordWithToken] Attempting to reset password with token: ${token.substring(0,10)}...`);

  try {
    if (!token || !newPassword) {
      return { success: false, error: 'Token and new password are required.' };
    }
    if (newPassword.trim().length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const collection = await getGoldsmithsCollection();
    const goldsmith = await collection.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() } // Check if token is not expired
    });

    if (!goldsmith) {
      console.log(`[Action: resetGoldsmithPasswordWithToken] Invalid or expired token provided.`);
      return { success: false, error: 'This password reset token is invalid or has expired.' };
    }

    // Hash the new password before storing it
    const newHashedPassword = await bcrypt.hash(newPassword.trim(), SALT_ROUNDS);
    
    // Update the password and clear the reset token fields
    const result = await collection.updateOne(
      { _id: goldsmith._id },
      {
        $set: { password: newHashedPassword },
        $unset: { passwordResetToken: "", passwordResetTokenExpires: "" }
      }
    );

    if (result.modifiedCount === 1) {
      console.log(`[Action: resetGoldsmithPasswordWithToken] Successfully reset password for ${goldsmith.email}.`);
      logAuditEvent('Goldsmith password successfully reset via token', { type: 'goldsmith', id: goldsmith.id }, { email: goldsmith.email });
      return { success: true };
    } else {
      return { success: false, error: 'Failed to update password. Please try again.' };
    }

  } catch (error) {
    console.error('[Action: resetGoldsmithPasswordWithToken] Error:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}
