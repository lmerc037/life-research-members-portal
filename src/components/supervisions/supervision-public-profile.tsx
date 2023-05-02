// This component displays the public profile of a supervision.
// It shows the first and last name of the supervision, and the description.

import Empty from "antd/lib/empty";
import Card from "antd/lib/card/Card";
import Title from "antd/lib/typography/Title";
import { FC, useContext } from "react";
import usePublicSupervisionInfo from "../../services/use-public-supervision-info";
import CardSkeleton from "../loading/card-skeleton";
import PublicSupervisionDescription from "./supervision-public-description";
import { LanguageCtx } from "../../services/context/language-ctx";
import DeleteSupervisionButton from "./delete-supervision-button";

type Props = {
  id: number;
};

const PublicSupervisionProfile: FC<Props> = ({ id }) => {
  const { supervision, loading } = usePublicSupervisionInfo(id);
  const { en } = useContext(LanguageCtx);

  if (loading) return <CardSkeleton />;
  if (!supervision) return <Empty />;

  const header = (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Title
        level={2}
        style={{
          margin: 0,
          minWidth: 0,
          marginRight: "auto",
          paddingRight: 16,
          whiteSpace: "break-spaces",
        }}
      >
        {`${supervision.first_name} ${supervision.last_name}`}
      </Title>
    </div>
  );

  return (
    <Card title={header}>
      <PublicSupervisionDescription supervision={supervision} />
    </Card>
  );
};

export default PublicSupervisionProfile;
