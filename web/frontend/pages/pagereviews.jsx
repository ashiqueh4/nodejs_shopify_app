import React from 'react'
import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { ReviewsListing } from "../components";

export default function PageReviews (){
  return (
    <Page>
    <TitleBar
      title="Reviews"
    />
    <Layout>
      <Layout.Section>
        <div className="review_outer_cd" style={{paddingBottom:"15px"}}><ReviewsListing/></div>
      </Layout.Section>
    </Layout>
  </Page>
  )
}
