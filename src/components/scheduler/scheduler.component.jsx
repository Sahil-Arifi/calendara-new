import { useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import { useAppState } from "../../services/state";
import { useGetOutlookUser, useRetrieveOutlookEvents } from "../../services/useEffectHandler";
import { getAllOutlookEvents } from "../../services";

export default function Dashboard() {
    const { isLoading, filterButtonState, setFilterButtonState, outlookUser, setOutlookUser, setMicrosoftEvents, microsoftAccessToken, microsoftEvents } = useAppState();

    useGetOutlookUser(setOutlookUser);
    useRetrieveOutlookEvents(getAllOutlookEvents, microsoftAccessToken, setMicrosoftEvents);
    useEffect(() => {
        console.log("Component rerendered with updated Microsoft events:", microsoftEvents);
      }, [microsoftEvents]);
      
    const outlookData = [
        {
          id: outlookUser.localAccountId,
          label: {
            title: outlookUser.name,
            subtitle: outlookUser.username,
          },
        //   data: microsoftEvents.map((event) => [
        //     {
        //         id: event.id,
        //         startDate: new Date(event.start),
        //         endDate: new Date(event.end),
        //         occupancy: event.occupancy,
        //         title: event.name,
        //         bgColor: "rgb(58, 134, 255)",
        //     },
        //   ])   
        }
      ];

      const googleData = [
        {
          id: outlookUser.localAccountId,
          label: {
            title: outlookUser.name,
            subtitle: outlookUser.username,
          },
          data: []   
        },
      ];

      const combinedData = [
        outlookData,
        googleData,
      ]

  return (
    <section>
      <Scheduler
        data={googleData}
        isLoading={isLoading}
        onRangeChange={(newRange) => console.log(newRange)}
        onTileClick={(clickedResource) => console.log(clickedResource)}
        onItemClick={(item) => console.log(item)}
        onFilterData={() => {
          // Some filtering logic...
          setFilterButtonState(1);
        }}
        onClearFilterData={() => {
          // Some clearing filters logic...
          setFilterButtonState(0)
        }}
        config={{
          zoom: 1,
          filterButtonState,
        }}
      />
    </section>
  );
}


// data: [
//     {
//       id: "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
//       startDate: new Date("2024-02-01T15:31:24.272Z"),
//       endDate: new Date("2024-02-28T10:28:22.649Z"),
//       occupancy: 3600,
//       title: "Project A",
//       subtitle: "Subtitle A",
//       description: "array indexing Salad West Account",
//       bgColor: "rgb(58, 134, 255)"
//     },
// ]