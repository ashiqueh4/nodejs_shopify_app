import { Card, Page, Layout, Spinner, Text,LegacyCard } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { OrderCard, TestCard } from "../components";


export default function TestPage() {

  // const { t } = useTranslation();
  
  return (
    <Page>
      <TitleBar
        title="TestPage"
      />
      <Layout>
        <Layout.Section>
          <div className="outer_cd" style={{paddingBottom:"15px"}}><TestCard/></div>
          <div className="outer_cd"><OrderCard/></div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
