import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Receipt } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";
import HistoryPresentation from "./HistoryPresentation";
import { receiptApi, tagApi, partyApi } from "../../Apis/apis";
import LoadingPresentation from "../../Components/LoadingPresentation";

const HistoryContainer = () => {
  const navigate = useNavigate();
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("전체");
  const { partyId } = useParams();
  const { receipts } = useParams();
  const context = useAppContext();

  const hasSelectedTag = context.receipts?.some(
    (receipt: Receipt) => receipt.useTag === selectedTag
  ) ?? false;
  

  const getCategoryReceipts = (category: string) => {
    const receipts = context.receipts || [];
    return receipts.filter(
      (receipt: Receipt) => receipt.useTag === category
    );
  };  

  const getReceiptsByCurrency = () => {
    const receiptsByCurrency: { [key: string]: Receipt[] } = {};
    context.receipts.forEach((receipt: Receipt) => {
      const currency = receipt.useCurrency ?? "전체";
      if (!receiptsByCurrency[currency]) {
        receiptsByCurrency[currency] = [];
      }
      receiptsByCurrency[currency].push(receipt);
    });
    return receiptsByCurrency;
  };

  const onBack = () => navigate(-1);

  const memberNames = context.party?.members ?? [];

  const partyName = context.party?.partyName ?? "";

  const partyTotal = context.totalCost?.toLocaleString();

  const calTotalCost = (receipts: Receipt[]) => {
    // 통화별 총 금액을 저장할 객체
    const totalCostsByCurrency: { [key: string]: number } = {};

    if (receipts) {
      receipts.forEach((receipt) => {
        // useCurrency가 undefined인 경우를 처리
        if (receipt.useCurrency) {
          if (!totalCostsByCurrency[receipt.useCurrency]) {
            totalCostsByCurrency[receipt.useCurrency] = 0;
          }
          totalCostsByCurrency[receipt.useCurrency] += receipt.cost;
        } else {
          console.warn(`Receipt with undefined currency found`);
        }
      });
    } else {
      console.log("등록된 영수증이 없습니다.");
    }

    return totalCostsByCurrency;
  };

  const handleTagClick = (tag: string) => {
    const filteredReciepts = context.receipts.filter(
      (receipt: Receipt) => receipt.useTag === tag
    );
    setFilteredReceipts(filteredReciepts);
    if (selectedTag === tag) {
      setSelectedTag("전체");
    } else {
      setSelectedTag(tag); // 선택된 태그 업데이트
      console.log(tag);
    }
  };

  const handleCurrencyClick = (currency: string) => {
    setSelectedCurrency(currency);
    if (currency === "전체") {
      setFilteredReceipts(context.receipts);
    } else {
      setFilteredReceipts(
        context.receipts.filter(
          (receipt: Receipt) => receipt.useCurrency === currency
        )
      );
    }
  };

  useEffect(() => {
    
    // 로딩 로직 추가
    receiptApi.getReceipts(partyId!!).then((response) => {
      context.setReceipts(response.data.receipts);
      console.log("히히" + context.receipts);
      console.log("안녕");
      calTotalCost(response.data.receipts);
      context.setTotalCost(calTotalCost(response.data.receipts) || 0);
      console.log(context.totalCost);
    });
    tagApi.getTags().then((response) => {
      context.setTags(response.data.tags);
      console.log(response.data.tags)
    });
    partyApi.getParty(partyId!!).then((response) => {
      context.setParty(response.data);
      console.log(response.data);
    });
    partyApi.getResult(partyId!!).then((response)=>{
      context.setSettlements(response.data.result);
      console.log("돈줘" + context.settlements);
      console.log("디버그디버그");
      
    })
    console.log(context.tags);
    context.setLoading(false);
  }, []);

  useEffect(() => {
    // "전체" 태그가 선택되었을 때 모든 영수증을 표시
    if (selectedTag === "전체") {
      setFilteredReceipts(context.receipts);
    } else {
      // 선택된 태그에 맞는 영수증을 필터링하여 표시
      const filteredReciepts = context.receipts.filter(
        (receipt: Receipt) => receipt.useTag === selectedTag
      );
      setFilteredReceipts(filteredReciepts);
    }
  }, [selectedTag, context.receipts]);

  return context.loading ? (
    <LoadingPresentation />
  ) : (
    <HistoryPresentation
      partyName={partyName}
      partyTotal={partyTotal}
      memberNames={memberNames}
      receipts={context.receipts}
      onBack={onBack}
      selectedTag={selectedTag}
      selectedCurrency={selectedCurrency}
      filteredReceipts={filteredReceipts}
      hasSelectedTag={hasSelectedTag}
      tags={context.tags}
      getCategoryReceipts={getCategoryReceipts}
      handleTagClick={handleTagClick}
      handleCurrencyClick={handleCurrencyClick}
      getReceiptsByCurrency={getReceiptsByCurrency}
    />
  );

  // 서버 연결 없을 때를 위한 코드
  /*return context.loading ? (
    <HistoryPresentation
      partyName={partyName}
      partyTotal={partyTotal}
      memberNames={memberNames}
      receipts={context.receipts}
      onBack={onBack}
      selectedTag={selectedTag}
      selectedCurrency={selectedCurrency}
      filteredReceipts={filteredReceipts}
      hasSelectedTag={hasSelectedTag}
      tags={context.tags}
      getCategoryReceipts={getCategoryReceipts}
      handleTagClick={handleTagClick}
      handleCurrencyClick={handleCurrencyClick}
      getReceiptsByCurrency={getReceiptsByCurrency}
    />
  ) : (
    <LoadingPresentation />
  );*/
};

export default HistoryContainer;
