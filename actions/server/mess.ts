'use server';

import { dbconnection } from "@/Components/lib/dbconnection";



export async function getMessNames() {
  try {
    const usersCollection = await dbconnection('users');
    

    const messes = await usersCollection
      .find({ 
        accountType: 'controller',
        messName: { $exists: true, $ne: '' }
      })
      .project({ messName: 1 })
      .toArray();


    const messNamesSet = new Set<string>();
    messes.forEach((user: any) => {
      if (user.messName && user.messName.trim()) {
        messNamesSet.add(user.messName.trim());
      }
    });

  
    const messNames = Array.from(messNamesSet).sort();

    return {
      success: true,
      data: messNames,
    };
  } catch (error) {
    console.error('Error fetching mess names:', error);
    return {
      success: false,
      error: 'Failed to fetch mess names',
      data: [],
    };
  }
}