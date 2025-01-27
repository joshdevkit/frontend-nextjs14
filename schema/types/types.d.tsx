export type PostTypes = {
  _id: string;
  content: string;
  images: Array<string>;
  videos: Array<string>;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
};

export type User = {
  _id: string;
  name: string;
  email: string;
};
