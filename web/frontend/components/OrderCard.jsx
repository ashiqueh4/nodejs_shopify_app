import {useState} from 'react'
import { useAppQuery ,useAuthenticatedFetch} from "../hooks";
import {IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  Spinner} from "@shopify/polaris";
import { Loading } from "./Loading"

export  const OrderCard = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [datas, setDatas] = useState([]);
    const fetch = useAuthenticatedFetch();

    const {
      data,
      isLoading: isLoadingr
    } = useAppQuery({
      url: "/api/orders/all",
      queryKey: ['orders'],
      reactQueryOptions: {
        onSuccess: (data) => {
          setIsLoading(false);
          console.log(data?.data)
          setDatas(data?.data)
        },
      },
    });

   // console.log(datas)
const resourceName = {
  singular: 'order',
  plural: 'orders',
};

const {selectedResources, allResourcesSelected, handleSelectionChange} =
  useIndexResourceState(datas);

const rowMarkup = datas?.map(
  (
    {id, order_number, created_at, customer, total_price, financial_status, fulfillment_status},
    index,
  ) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {order_number}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{created_at}</IndexTable.Cell>
      <IndexTable.Cell>{customer.first_name}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {total_price}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{financial_status}</IndexTable.Cell>
      <IndexTable.Cell>{!fulfillment_status?"No status":fulfillment_status}</IndexTable.Cell>
    </IndexTable.Row>
  ),
);



if (isLoadingr) return <Loading/>;

  return (
  <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={datas.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'order_number'},
          {title: 'created_at'},
          {title: 'Customer'},
          {title: 'Total', alignment: 'end'},
          {title: 'Payment status'},
          {title: 'Fulfillment status'},
        ]}
      >
        { rowMarkup}
      </IndexTable>
    </LegacyCard>
  )
}




 

