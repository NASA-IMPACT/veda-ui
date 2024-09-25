import React, {useState} from 'react';

import { Button } from '@devseed-ui/button';
import { 
  CollecticonHandThumbsUp, 
  CollecticonHandThumbsDown, 
  CollecticonLink, 
  CollecticonChevronUpTrailSmall, 
  CollecticonChevronDownTrailSmall,
} from '@devseed-ui/collecticons';

import styled from 'styled-components';

const DialogContent = styled.div`
  width: fit-content;
  max-width: 75%;
  min-width: 25%;
  background: white;
  padding: 1em;
  margin: 1em 0 1em 1em;
  margin-right: auto;
  border-radius: 10px;
`;

const DialogInteraction = styled.div`
  font-size: 0.6rem;
  display: flex;
`

const ButtonContent = styled.span`
  font-size: 0.6rem;
`

const ShowHideDetail = styled.div`
  margin-left: auto;
`

const AnswerDetails = styled.div`
  font-size: 0.6rem;
  padding: 1em;
  background: #f6f7f8;
  border-radius: 10px;

  pre {
    text-wrap: pretty;
  }
`

export interface GeoCoPilotModalProps {
    summary: string;
    dataset_ids: any;
    bbox: any;
    dateRange: any;
    date: Date;
    action: string;
    explanation: any;
    query: string;
}

export function GeoCoPilotSystemDialogComponent({summary, dataset_ids, bbox, dateRange, date, action, explanation, query}: {
    summary: string;
    dataset_ids: any;
    bbox: any;
    dateRange: any;
    date: Date;
    action: string;
    explanation: any;
    query: string;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const updateShowDetails = () => {
    setShowDetails(!showDetails);
  }

  const copyURL = () => {
    navigator.clipboard.writeText(document.URL);
  }

  return (
    <DialogContent>
      <div>{summary}</div>  
      {/*Content*/}
      {explanation && <DialogInteraction>
        <div>
          <Button size={'small'}>
            <CollecticonHandThumbsUp size={10} />
          </Button>
          <Button size={'small'}>
            <CollecticonHandThumbsDown size={10}/>
          </Button>
        </div> | 
        {/*Interaction*/}
        <div>
          <Button size={'small'}>
            <CollecticonLink size={10} /> 
            <ButtonContent onClick={copyURL}>Copy Map Link</ButtonContent>
          </Button>
        </div>
        {/*Summary*/}
        <ShowHideDetail onClick={updateShowDetails}>
          <Button size={'small'}>
            
            {showDetails ? 
              <>
                <ButtonContent>Hide Details</ButtonContent> <CollecticonChevronUpTrailSmall size={10}/>
              </> : 
              <>
                <ButtonContent>Show Details</ButtonContent> <CollecticonChevronDownTrailSmall size={10}/>
              </>
            }
          </Button>
        </ShowHideDetail>
      </DialogInteraction>}
      {
        showDetails && 
        <AnswerDetails>
          <pre>
            {JSON.stringify(explanation?.verification)}
          </pre>
        </AnswerDetails> 
      }
    </DialogContent>
  )
}

export function GeoCoPilotSystemDialog(props: GeoCoPilotModalProps) {
    const {summary, dataset_ids, bbox, dateRange, date, action, explanation, query} = props;
    return <GeoCoPilotSystemDialogComponent
        summary={summary}
        dataset_ids={dataset_ids}
        bbox={bbox}
        dateRange={dateRange}
        date={date}
        action={action}
        explanation={explanation}
        query={query}
    />
}
