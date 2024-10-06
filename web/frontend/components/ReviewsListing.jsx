import {useState,useRef, useEffect} from 'react'
import { Link } from "react-router-dom";
import {IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  Spinner,
  Modal,ButtonGroup,Button} from "@shopify/polaris";
import { Loading } from "./Loading"
import useApiRequest from '../hooks/useApiRequest';
import { Modalrev } from './Modalrev';
import { useQuery ,useMutation,useQueryClient } from 'react-query';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';


export const ReviewsListing = () => {

  const [rid,setRid]=useState();
 
  // let {responseData, isLoading, error} = useApiRequest("/api/getreviews", "GET");
  // if(!isLoading) console.log(responseData)
  let fetch = useAuthenticatedFetch();

  const { isLoading, isError, data:responseData, error,refetch: refetchProductCount, } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await fetch('/api/getreviews')
      return response.json()
    },
  })


  // delete:

  const mutationDelete = useMutation({
    mutationFn: async(rid) => {
      return await fetch(`/api/reviewdelete/${rid}`,{
        method: 'DELETE'
    })
    },
    onSuccess: async () => {
      await refetchProductCount()
      console.log("I'm first!")
    },
    onSettled: async () => {
      await refetchProductCount()
      console.log("I'm second!")
    },
  })
 
  

  const resourceName = {
    singular: 'review',
    plural: 'reviews',
  };

  function formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
}

  // const resourceIDResolver = (responseData) => {
  //   return responseData._id;
  // };

  const childRef = useRef(null);

 
  const selectedResourcess = (id) => {
    // setRid(id)
    let review_data=responseData?.find((itemId)=>itemId._id === id);
    childRef.current.childFunction1(review_data);
  };




  // const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(responseData,{resourceIDResolver});

  const rowMarkup = responseData?.map(
    (
      {_id, rating, name, email, feedback, date},
      index,
    ) => (
      <IndexTable.Row
        // id={_id}
        key={_id}
        // selected={selectedResources.includes(_id)}
        // position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {rating}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>{email}</IndexTable.Cell>
        {/* <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {feedback}
          </Text>
        </IndexTable.Cell> */}
        <IndexTable.Cell>{ formatDate(date) }</IndexTable.Cell>
        <IndexTable.Cell>
        <ButtonGroup>
          <Button onClick={()=>selectedResourcess(_id)}>View</Button>
          <Button variant="primary" onClick={()=>mutationDelete.mutate(_id)}>Delete</Button>
        </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );


 if(isLoading)return <Loading/>;

  return (
    <>
  
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={responseData?.length}
        // selectedItemsCount={
        //   allResourcesSelected ? 'All' : selectedResources.length
        // }
        // onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'Rating'},
          {title: 'Name'},
          {title: 'Email'},
          // {title: 'Feedback'},
          {title: 'Date'},
          {title: 'action'}
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
    <Modalrev ref={childRef}/>
    </>
  )
}

