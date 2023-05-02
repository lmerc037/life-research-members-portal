// Footer component for the LIFE Research Institute website
// Displayed at the bottom of every page
// Shows the copyright information and a link to the privacy policy of the University of Ottawa (the parent organization of LIFE Research Institute)
// The language for the footer text is determined by the context from the LanguageCtx provider.

import { Row, Col } from "antd";
import SafeLink from "./link/safe-link";
import { useContext } from "react";
import { LanguageCtx } from "../services/context/language-ctx";

const Footer = () => {
  const { en } = useContext(LanguageCtx);

  return (
    <footer>
      <Row justify="space-between" align="middle" style={{ padding: "16px 0" }}>
        <Col>
          <span>
            © {new Date().getFullYear()} LIFE Research Institute.{" "}
            {en ? "All rights reserved." : "Tous droits réservés."}
          </span>
        </Col>
        <Col>
          <SafeLink
            href={
              en
                ? "https://www.uottawa.ca/about-us/aipo/privacy-rights"
                : "https://www.uottawa.ca/notre-universite/baipvp/protection-vie-privee"
            }
            external
          >
            {en ? "Privacy Policy" : "Politique de confidentialité"}
          </SafeLink>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
