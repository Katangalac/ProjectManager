import { clsx } from "clsx";
import { useTeamById } from "../hooks/queries/team/useTeamById";
import { useParams } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import TeamMembersTable from "../components/team/TeamMembersTable";
import { InputTextarea } from "primereact/inputtextarea";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function TeamDetailsPage() {
  const { teamId } = useParams();
  const { data, isLoading, isError } = useTeamById(teamId!);
  console.log(data);
  if (isError) return <div>An error occur while loading team</div>;
  return (
    <div className={clsx("flex min-h-screen items-start justify-start gap-5")}>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <>
          <div
            className={clsx(
              "flex w-full flex-col items-start justify-start gap-5"
            )}
          >
            <div
              className={clsx(
                "memberPage flex w-full items-center justify-between"
              )}
            >
              <span
                className={clsx(
                  "flex cursor-pointer items-center gap-1 text-sm text-sky-600 hover:text-sky-700"
                )}
              >
                <PlusIcon className={clsx("size-3.5 stroke-2")} /> Add members
              </span>
              <input
                className={clsx(
                  "w-70 rounded-sm border border-gray-300 px-2 py-1 text-sm text-gray-700 placeholder:text-gray-500"
                )}
                title="Search members"
                placeholder="Search members..."
              />
            </div>
            <div className={clsx("flex w-full items-start justify-start")}>
              <Accordion multiple className="flex flex-col gap-5">
                <AccordionTab
                  header="Leader"
                  className={clsx(
                    "bg-white py-1 text-left text-sm font-normal text-gray-700 hover:bg-white"
                  )}
                >
                  {data && (
                    <TeamMembersTable showLeaderOnly={true} team={data} />
                  )}
                </AccordionTab>
                <AccordionTab
                  header={`Members (${data?.teamUsers?.length})`}
                  className={clsx(
                    "bg-white py-1 text-left text-sm font-normal text-gray-700 hover:bg-white"
                  )}
                >
                  {data && (
                    <TeamMembersTable showLeaderOnly={false} team={data} />
                  )}
                </AccordionTab>
                <AccordionTab
                  header="Description"
                  className={clsx(
                    "bg-white py-1 text-left text-sm font-normal text-gray-700 hover:bg-white"
                  )}
                >
                  {data?.description && (
                    <InputTextarea
                      value={data.description}
                      disabled={true}
                      rows={5}
                      cols={30}
                      className={clsx(
                        "myText md:w-14rem w-full py-1.5 pl-4",
                        "rounded-sm border border-gray-300"
                      )}
                      placeholder="No description"
                    />
                  )}
                </AccordionTab>
              </Accordion>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
