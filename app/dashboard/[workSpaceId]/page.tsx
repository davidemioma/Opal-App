import Wrapper from "./_components/Wrapper";

export default async function Workspace({
  params: { workSpaceId },
}: {
  params: { workSpaceId: string };
}) {
  return <Wrapper workSpaceId={workSpaceId}>Workspace {workSpaceId}</Wrapper>;
}
