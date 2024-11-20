export type VideoType = {
  id: string;
  createdAt: Date;
  source: string;
  title: string;
  processing: boolean;
  user: {
    image: string | null;
    firstname: string | null;
    lastname: string | null;
  };
  workspace: {
    name: string;
  };
  folder: {
    id: string;
    name: string;
  };
};
