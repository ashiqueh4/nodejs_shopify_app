import {
    Button,
    Modal,
    LegacyStack,
    TextContainer,
    Frame,
    ButtonGroup
  } from '@shopify/polaris';
  import {useState, useCallback,forwardRef, useImperativeHandle,useEffect} from 'react';
  import { Loading } from "./Loading"
import useApiRequest from '../hooks/useApiRequest';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { useMutation,useQueryClient  } from 'react-query';
  
  
 export const Modalrev = forwardRef((props, ref) => {

    const [active, setActive] = useState(false);
    const [rid, setRid] = useState();
  
    const toggleModal = useCallback(() => setActive((active) => !active), []);

    // let fetch = useAuthenticatedFetch();

    // const mutation = useMutation({
    //   mutationFn: async() => {
    //     return await fetch(`/api/reviewdelete/${rid?._id}`,{
    //       method: 'DELETE'
    //   })
    //   },
    // })
    // const reviewDelete = () => {
    //   // console.log("dd"+rid?._id);
    //   // mutation.mutate();
    //   toggleModal();
    // }

    useImperativeHandle(ref, () => ({
      childFunction1(review_data) {
        setRid(review_data)
        toggleModal();
      }
    }));



 
    return (
      <>
      {active &&
      <div style={{height: '500px'}}>
        <Frame>
          <Modal
            // activator={activator}
            open={active}
            onClose={toggleModal}
            title="Review Details"
            primaryAction={{
              content: 'Close',
              onAction: toggleModal,
            }}
            // secondaryActions={[
            //   {
            //     destructive: true,
            //     content: 'Delete',
            //     onAction: reviewDelete,
            //   },
            // ]}
            
          >
            <Modal.Section>
              <LegacyStack vertical>
                <LegacyStack.Item>
                <TextContainer>
                      <p>
                       {rid?.feedback}
                      </p>
                   </TextContainer>
                </LegacyStack.Item>
              </LegacyStack>
            </Modal.Section>
          </Modal>
        </Frame>
      </div>
      }
      </>
    );
  });


