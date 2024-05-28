import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Receipt } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";
import HistoryPresentation from "./HistoryPresentation";
import { receiptApi } from "../../Apis/apis";

const HistoryContainer = () => {
  const navigate = useNavigate();
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const { partyId } = useParams();
  const context = useAppContext();
  
  const hasSelectedTag = context.receipts.some(
    (receipt: Receipt) => receipt.tag === selectedTag
  );

  const categories = ["음식", "보관", "교통", "입장료", "숙박", "엔터"];

  const getCategoryReceipts = (category: string) => {
    return dummyReceipts.filter((receipt) => receipt.tag?.name === category);
  };


  const onBack = () => navigate(-1);

  const memberNames = dummyMembers.map((member) => member.name);

  const partyName = dummyParties.map((party) => party.name);

  const partyTotal = dummyParties.reduce(
    (acc, party) => acc + party.totalCost,
    0
  );
  

  const handleTagClick = (tag: string) => {
    const filteredReciepts = dummyReceipts.filter(
      (receipt) => receipt.tag?.name === tag
    );
    setFilteredReceipts(filteredReciepts);
    if (selectedTag === tag) {
      setSelectedTag("전체");
    } else {
      setSelectedTag(tag); // 선택된 태그 업데이트
    }
  };

  useEffect(() => {
    //로딩 로직 추가
    receiptApi.getReceipts(partyId!!).then((response) => {
      context.setReceipts(response.data);
      context.setLoading(false);//로딩 완료
    });
    // "전체" 태그가 선택되었을 때 모든 영수증을 표시
    if (selectedTag === "전체") {
      setFilteredReceipts(dummyReceipts);
    } else {
      // 선택된 태그에 맞는 영수증을 필터링하여 표시
      const filteredReciepts = dummyReceipts.filter(
        (receipt) => receipt.tag?.name === selectedTag
      );
      setFilteredReceipts(filteredReciepts);
    }
  }, [selectedTag]);


  return (
      context.loading ?
        <div>loading...</div> 
      :
        <HistoryPresentation
          partyName={partyName[0]}
          partyTotal={partyTotal}
          memberNames={memberNames}
          onBack={onBack}
          selectedTag={selectedTag}
          filteredReceipts={filteredReceipts}
          hasSelectedTag={hasSelectedTag}
          categories={categories}
          getCategoryReceipts={getCategoryReceipts} dummyReceipts={[]}
        />
  );
};

export default HistoryContainer;