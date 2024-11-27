import TravelHistory from "./components/travel-history";
import TravelOptions from "./components/travel-options";
import React from "react";
import TravelRequest from "./components/travel-request";
import type { EstimateValueResProps } from "./lib/types";

export default function ProtectedPage() {
  const [page, setPage] = React.useState<string>("request");
  const [data, setData] = React.useState<EstimateValueResProps | null>(null);
  const [customer_id, setCustomer_id] = React.useState<string>("");
  const [origin, setOrigin] = React.useState<string>("");
  const [destination, setDestination] = React.useState<string>("");

  return (
    <div className="w-full flex items-center justify-center mx-auto h-screen">
      {page === "request" && (
        <TravelRequest
          onEstimateValue={(data, customer_id, origin, destination) => {
            setOrigin(origin);
            setDestination(destination);
            setCustomer_id(customer_id);
            setData(data);
            setPage("options");
          }}
        />
      )}
      {page === "options" && (
        <TravelOptions
          data={data || null}
          customer_id={customer_id}
          origin={origin}
          destination={destination}
          onCreate={() => setPage("history")}
        />
      )}
      {page === "history" && <TravelHistory />}
    </div>
  );
}
