import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  // Handle the webhook
  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Error processing webhook', { status: 500 })
  }

  return new Response('', { status: 200 })
}

async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = data;

  console.log('handleUserCreated called with data:', JSON.stringify(data, null, 2));

  // Better error handling and validation
  const email = email_addresses?.[0]?.email_address;
  if (!email) {
    console.error('No email address found in webhook data');
    throw new Error('Email address is required');
  }

  try {
    const userData = {
      id: id,
      email: email,
      firstName: first_name || null,
      lastName: last_name || null,
      avatar: image_url || null,
      phone: phone_numbers?.[0]?.phone_number || null,
    };

    console.log('Creating user with data:', userData);

    const user = await prisma.user.create({
      data: userData,
    });
    
    console.log(`User created successfully:`, user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // More detailed error logging
    if (error.code === 'P2002') {
      console.error('Unique constraint violation - user may already exist');
      // You might want to try updating instead of creating
      try {
        const updatedUser = await prisma.user.update({
          where: { id: id },
          data: {
            email: email,
            firstName: first_name || null,
            lastName: last_name || null,
            avatar: image_url || null,
            phone: phone_numbers?.[0]?.phone_number || null,
          },
        });
        console.log(`User updated instead:`, updatedUser);
        return;
      } catch (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }
    }
    
    if (error.code) {
      console.error('Prisma error code:', error.code);
    }
    if (error.meta) {
      console.error('Prisma error meta:', JSON.stringify(error.meta, null, 2));
    }
    throw error;
  }
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = data

  // Better validation
  const email = email_addresses?.[0]?.email_address;
  if (!email) {
    console.error('No email address found in webhook data');
    throw new Error('Email address is required');
  }

  try {
    await prisma.user.upsert({
      where: { id },
      update: {
        email: email,
        firstName: first_name || null,
        lastName: last_name || null,
        avatar: image_url || null,
        phone: phone_numbers?.[0]?.phone_number || null,
      },
      create: {
        id: id,
        email: email,
        firstName: first_name || null,
        lastName: last_name || null,
        avatar: image_url || null,
        phone: phone_numbers?.[0]?.phone_number || null,
      },
    })
    console.log(`User updated: ${id}`)
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

async function handleUserDeleted(data: any) {
  const { id } = data

  try {
    // Delete user and cascade to related records
    await prisma.user.delete({
      where: { id },
    })
    console.log(`User deleted: ${id}`)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}