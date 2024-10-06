import React from 'react'
import {
    LegacyCard,
    Spinner,Layout} from "@shopify/polaris";

export const Loading = () => {
    return (
        <Layout>
        <Layout.Section> 
        <LegacyCard>
            <div className='loading_wrapper' style={{ minHeight:"250px",display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner accessibilityLabel="Spinner example" size="large" /> </div>
        </LegacyCard>
        </Layout.Section>
        </Layout>
    )
}





