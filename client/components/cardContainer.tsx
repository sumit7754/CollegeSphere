interface user {
  Name: string;
  imageURL?: string;
  content?: string;
  likes?: number;
  impressions?: number;
  reposts?: number;
  comments?: number;
  id: string;
}

const cardContainer: React.FC<user> = () => {
  return <div></div>;
};
