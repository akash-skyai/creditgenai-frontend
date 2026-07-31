export interface PostalData {
  city: string;
  state: string;
}

export async function fetchPostalData(pincode: string): Promise<PostalData> {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  if (!res.ok) {
    throw new Error('Failed to fetch postal data');
  }
  
  const data = await res.json();
  
  if (
    data && 
    data[0] && 
    data[0].Status === 'Success' && 
    data[0].PostOffice && 
    data[0].PostOffice.length > 0
  ) {
    const postOffice = data[0].PostOffice[0];
    return {
      city: postOffice.District,
      state: postOffice.State
    };
  }
  
  throw new Error('Invalid PIN Code. Please enter a valid 6-digit Indian PIN Code.');
}
