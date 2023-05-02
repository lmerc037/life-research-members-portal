// This is a functional component that returns a list of names of grant investigators as a list of Ant Design tags
// The names are wrapped in a SafeLink component that links to the profile of each member
// The color of each tag is generated from the string value of the name using the colorFromString utility function

import React from "react";
import PageRoutes from "../../routing/page-routes";
import SafeLink from "../link/safe-link";
import Tag from "antd/lib/tag";
import colorFromString from "../../utils/front-end/color-from-string";

const getInvestigatorMember = (
  grant_investigator_member: Array<{
    member: {
      id: number;
      account: { first_name: string; last_name: string };
    };
  }>
) => {
  const memberNames = grant_investigator_member.map((investigator_member) => {
    const name =
      investigator_member.member.account.first_name +
      " " +
      investigator_member.member.account.last_name;
    return (
      // eslint-disable-next-line react/jsx-key
      <SafeLink href={PageRoutes.memberProfile(investigator_member.member.id)}>
        <Tag color={colorFromString(name)}>{name}</Tag>
      </SafeLink>
    );
  });
  return <>{memberNames}</>;
};

export default getInvestigatorMember;
