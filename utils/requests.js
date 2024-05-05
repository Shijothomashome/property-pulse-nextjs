const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all properties
async function fetchProperties() {
  try {
    // Handle the case where the domain is not available yet
    // when we deploy the NEXT_PUBLIC_API_DOMAIN will not be available. So to avoid error we return empty array here as well as in the catch block.
    // now when we deploy, we won't get an error and then we can go into our server environment variables and update this domain to whatever, the domain is.
    if (!apiDomain) {
      return [];
    }
    
    const res = await fetch(`${apiDomain}/properties`, { cache: "no-store" }); // if we added new properties then to update the ui with new property after return back to properties page we need to put cache: no-store here.

    if (!res.ok) {
      throw new Error("Failed to fetch data"); // will be shown in the terminal
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch single property
async function fetchProperty(id) {
  try {
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      // const errorMessage = await res.json();
      // console.log(errorMessage);
      throw new Error("Failed to fetch data"); // will be shown in the terminal
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { fetchProperties, fetchProperty };
