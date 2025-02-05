export async function getSubscription({ getToken }) {
    try {
        const token = await getToken({ template: "supabase_2" });

        const url = `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}get-subscription`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || `Error ${response.status}`;
            throw new Error(errorMessage);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error fetching subscription:", error);
        throw error;
    }
}