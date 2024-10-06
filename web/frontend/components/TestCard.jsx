import {useState} from 'react'
import { useAppQuery } from "../hooks";
import { Page, Layout, LegacyCard, Spinner, Text, } from "@shopify/polaris";


export  const TestCard = () => {

    const [isLoading, setIsLoading] = useState(true);

    const {
      data,
      isLoading: isLoadingC
    } = useAppQuery({
      url: "/api/shop",
      queryKey: ['shop'],
      reactQueryOptions: {
        onSuccess: () => {
          setIsLoading(false);
        },
      },
    });

// if (isLoadingC) return <Spinner accessibilityLabel="Spinner example" size="large" />;

  return (
      <Layout>
        <Layout.Section>  
      {data?.data.map(({name},index)=>(
      <LegacyCard title={name} sectioned key={index}>
       <Text as="h2" variant="bodyMd">
         {name} : ALL ORDERS
         </Text>
          </LegacyCard>
         ))}
        </Layout.Section>
      </Layout>    
  )
}



