

import { getListingDetail } from "@/lib/getListingDetail";
import ListingDetailClient from "./ListingDetailClient";

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getListingDetail(id);

    return <ListingDetailClient data={data} />;
}
