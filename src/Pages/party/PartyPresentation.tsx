import { Party } from "../../Interfaces/interfaces";

interface PartyPresentationProps {
  party: Party;
  onClickCreateReceipt: () => void;
}

const PartyPresentation = (props: PartyPresentationProps) => (
  <div>
    {props.party.partyName}
    <div onClick={props.onClickCreateReceipt}>create Reciept</div>
  </div>
);

export default PartyPresentation;