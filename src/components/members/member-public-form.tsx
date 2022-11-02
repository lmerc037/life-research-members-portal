import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import React, { FC, Fragment, useContext, useState } from "react";
import type { MemberPrivateInfo, ProblemInfo, MemberPublicInfo } from "../../services/_types";
import updateMemberPublic from "../../services/update-member-public";
import type { keyword, problem } from "@prisma/client";
import { LanguageCtx } from "../../services/context/language-ctx";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import { FacultiesCtx } from "../../services/context/faculties-ctx";
import { MemberTypesCtx } from "../../services/context/member-types-ctx";
import GetLanguage from "../../utils/front-end/get-language";
import Divider from "antd/lib/divider";
import type { UpdateMemberPublicParams } from "../../pages/api/update-member/[id]/public";
import Text from "antd/lib/typography/Text";
import KeywordSelector from "../keywords/keyword-selector";

const { Option } = Select;

type Props = {
  member: MemberPublicInfo;
  onValuesChange?: (changedValues: any, values: Data) => void;
  onSuccess?: (member: MemberPrivateInfo) => void;
};

type Data = {
  first_name: string;
  last_name: string;
  about_me_en: string;
  about_me_fr: string;
  faculty_id?: number;
  type_id?: number;
  problems: ProblemInfo[];
  keywords: Map<number, keyword>;
  work_email: string;
  work_phone: string;
  website_link: string;
  twitter_link: string;
  linkedin_link: string;
  cv_link: string;
};

const PublicMemberForm: FC<Props> = ({ member, onValuesChange, onSuccess }) => {
  // This sets the return type of the form
  const [form] = useForm<Data>();
  const { en } = useContext(LanguageCtx);
  const { memberTypes } = useContext(MemberTypesCtx);
  const { faculties } = useContext(FacultiesCtx);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(data: Data) {
    setLoading(true);
    const { addProblems, deleteProblems } = diffProblems(data.problems);
    const { addKeywords, deleteKeywords } = diffKeywords(data.keywords);
    const params: UpdateMemberPublicParams = {
      first_name: data.first_name,
      last_name: data.last_name,
      about_me_en: data.about_me_en,
      about_me_fr: data.about_me_fr,
      faculty_id: data.faculty_id || null,
      type_id: data.type_id || null,
      work_email: data.work_email,
      work_phone: data.work_phone,
      website_link: data.website_link,
      twitter_link: data.twitter_link,
      linkedin_link: data.linkedin_link,
      cv_link: data.cv_link,
      deleteProblems,
      addProblems,
      deleteKeywords,
      addKeywords,
    };
    const newInfo = await updateMemberPublic(member.id, params);
    setLoading(false);
    if (newInfo && onSuccess) onSuccess(newInfo);
  }

  function getInitialProblems() {
    const problems: ProblemInfo[] = [];
    for (const i of [0, 1, 2]) {
      const problem = member.problem[i] as problem | undefined;
      problems[i] = { name_en: problem?.name_en || "", name_fr: problem?.name_fr || "" };
    }
    return problems;
  }

  function diffProblems(newProblems: ProblemInfo[]): {
    addProblems: ProblemInfo[];
    deleteProblems: number[];
  } {
    const oldProblems = member.problem;
    const addProblems = [];
    const deleteProblems = [];
    for (const [i, newP] of newProblems.entries()) {
      const oldP = oldProblems[i] as problem | undefined;
      const different = oldP?.name_en !== newP.name_en || oldP?.name_fr !== newP.name_fr;
      const hasName = newP.name_en || newP.name_fr;
      if (different) {
        if (oldP) deleteProblems.push(oldP.id);
        if (hasName) addProblems.push(newP);
      }
    }
    return { addProblems, deleteProblems };
  }

  function getInitialKeywords() {
    return new Map(member.has_keyword.map((k) => [k.keyword.id, k.keyword]));
  }

  function diffKeywords(newKeywords: Map<number, keyword>): {
    deleteKeywords: number[];
    addKeywords: number[];
  } {
    const oldIds = new Set<number>();
    const newIds = new Set<number>();
    const deleteKeywords: number[] = [];
    const addKeywords: number[] = [];
    for (const has_keyword of member.has_keyword) oldIds.add(has_keyword.keyword.id);
    for (const keyword of newKeywords.values()) newIds.add(keyword.id);
    for (const oldId of oldIds.values()) if (!newIds.has(oldId)) deleteKeywords.push(oldId);
    for (const newId of newIds.values()) if (!oldIds.has(newId)) addKeywords.push(newId);
    return { deleteKeywords, addKeywords };
  }

  const initialValues: Data = {
    first_name: member.account.first_name,
    last_name: member.account.last_name,
    about_me_en: member.about_me_en || "",
    about_me_fr: member.about_me_fr || "",
    faculty_id: member.faculty?.id,
    type_id: member.member_type?.id,
    work_email: member.work_email || "",
    work_phone: member.work_phone || "",
    website_link: member.website_link || "",
    twitter_link: member.twitter_link || "",
    linkedin_link: member.linkedin_link || "",
    cv_link: member.cv_link || "",
    problems: getInitialProblems(),
    keywords: getInitialKeywords(),
  };

  return (
    <div className="public-member-form-container">
      <Text strong>
        {en
          ? "Let everyone know what you do! You are encouraged to provide both languages where applicable, but it is not required."
          : "Faites savoir à tout le monde ce que vous faites ! Vous êtes encouragé à fournir les deux langues, le cas échéant, mais ce n'est pas obligatoire."}
      </Text>
      <Divider />
      <Form
        form={form}
        onFinish={handleUpdate}
        initialValues={initialValues}
        layout="vertical"
        className="public-member-form"
        onValuesChange={onValuesChange}
      >
        <div className="row">
          <Form.Item
            label={en ? "First Name" : "Prénom"}
            name="first_name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={en ? "Last Name" : "Nom de Famille"}
            name="last_name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={en ? "Member Type" : "Type de Membre"} name="type_id">
            <Select>
              <Option value="">{""}</Option>
              {memberTypes.map((f) => (
                <Option key={f.id} value={f.id}>
                  <GetLanguage obj={f} />
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="faculty" label={en ? "Faculty" : "Faculté"} name="faculty_id">
            <Select>
              <Option value="">{""}</Option>
              {faculties.map((f) => (
                <Option key={f.id} value={f.id}>
                  <GetLanguage obj={f} />
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={en ? "Work Email" : "Email de Travail"}
            name="work_email"
            rules={[{ type: "email", message: en ? "Invalid Email" : "Email Invalide" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={en ? "Work Phone" : "Téléphone de Travail"} name="work_phone">
            <Input type="tel" />
          </Form.Item>
        </div>

        <Divider />
        <div className="row">
          <Form.Item
            label={en ? "About Me (English)" : "À Propos de Moi (Anglais)"}
            name="about_me_en"
          >
            <TextArea rows={4} spellCheck="false" />
          </Form.Item>

          <Form.Item
            label={en ? "About Me (French)" : "À Propos de Moi (Français)"}
            name="about_me_fr"
          >
            <TextArea rows={4} spellCheck="false" />
          </Form.Item>
        </div>

        <label>{en ? "Problems I Work On" : "Problèmes sur Lesquels Je Travaille"}</label>
        <Divider />
        <Form.List name="problems">
          {(fields) =>
            fields.map((field) => (
              <Fragment key={field.key}>
                <div className="row">
                  <Form.Item
                    name={[field.name, "name_en"]}
                    label={
                      en
                        ? "Problem " + (field.name + 1) + " (English)"
                        : "Problème " + (field.name + 1) + " (Anglais)"
                    }
                  >
                    <TextArea rows={1} spellCheck="false" />
                  </Form.Item>

                  <Form.Item
                    key={field.key}
                    name={[field.name, "name_fr"]}
                    label={
                      en
                        ? "Problem " + (field.name + 1) + " (French)"
                        : "Problème " + (field.name + 1) + " (Français)"
                    }
                  >
                    <TextArea rows={1} spellCheck="false" />
                  </Form.Item>
                </div>
                <Divider />
              </Fragment>
            ))
          }
        </Form.List>

        <label htmlFor="keywords">{en ? "Keywords" : "Mots Clés	"}</label>
        <Divider />
        <Form.Item name="keywords">
          <KeywordSelector setErrors={(e) => form.setFields([{ name: "keywords", errors: e }])} />
        </Form.Item>
        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ paddingLeft: 40, paddingRight: 40 }}
            size="large"
            loading={loading}
          >
            {en ? "Save Changes" : "Sauvegarder"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PublicMemberForm;
