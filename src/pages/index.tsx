import type { NextPage } from "next/types";
import Welcome from "../components/welcome";
import Layout from "../components/layout/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Welcome />
    </Layout>
  );
};

export default Home;
