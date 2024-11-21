import Wrapper from "../../_components/Wrapper";

export default async function VideoPage({
  params: { workSpaceId, videoId },
}: {
  params: { workSpaceId: string; videoId: string };
}) {
  return (
    <Wrapper workSpaceId={workSpaceId}>
      <div>VideoPage</div>
    </Wrapper>
  );
}
