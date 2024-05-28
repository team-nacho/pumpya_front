import { Party } from "../../Interfaces/interfaces";

interface PartyPresentationProps {
  party: Party;
  onClickCreateReceipt: () => void;
  onClickAddMember: () => void;
}

const PartyPresentation = (props: PartyPresentationProps) => (
  <div>
    {props.party.partyName}
    <div onClick={props.onClickCreateReceipt}>create Reciept</div>
    <div>멤버</div>
    {
      props.party.members.map((member, index) => {
        return (
          <div key={index}>
            {member}
          </div>
        )
      })
    }
    <div onClick={props.onClickAddMember}>add member</div>
    <div>receipts</div>
    {
      props.party.receipts.map((receipt, index) => {
        return (
          <div key={index}>
            {receipt.receiptName}
          </div>
        )
      })
    }
  </div>
);

export default PartyPresentation;