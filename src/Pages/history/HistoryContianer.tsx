import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Receipt, Currency, ExchangeRate } from "../../Interfaces/interfaces";
import { useAppContext } from "../../AppContext";
import HistoryPresentation from "./HistoryPresentation";
import { receiptApi, partyApi, currencyApi, tagApi } from "../../Apis/apis";
import LoadingPresentation from "../../Components/LoadingPresentation";
import { useToast } from "@chakra-ui/react";

const HistoryContainer = () => {
  const toast = useToast();
  const onStart = () => {
    navigate("/");
  };
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: `주소가 복사되었습니다`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: `error copy`,
          status: "error",
          isClosable: true,
        });
      });
  };
  const navigate = useNavigate();
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("전체");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [exchange, setExchange] = useState<ExchangeRate[]>([]);
  const { partyId } = useParams();
  const { receipts } = useParams();
  const context = useAppContext();

  const hasSelectedTag =
    context.receipts?.some(
      (receipt: Receipt) => receipt.useTag === selectedTag
    ) ?? false;

  const getCategoryReceipts = (category: string) => {
    const receipts = context.receipts || [];
    return receipts.filter((receipt: Receipt) => receipt.useTag === category);
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

  // 통화별 비용 계산
  const calTotalCost = (receipts: Receipt[], currencies: Currency[]) => {
    const totalCostsByCurrency: { [useCurrency: string]: number } = {};

    currencies.forEach((currency) => {
      totalCostsByCurrency[currency.currencyId] = 0;
    });

    if (receipts) {
      receipts.forEach((receipt) => {
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

  const getUsedCurrencies = (
    receipts: Receipt[],
    allCurrencies: Currency[]
  ) => {
    const usedCurrencyIds: Set<string> = new Set();

    receipts.forEach((receipt) => {
      if (receipt.useCurrency) {
        usedCurrencyIds.add(receipt.useCurrency);
      }
    });

    // 사용된 통화만 반환
    return allCurrencies.filter((currency) =>
      usedCurrencyIds.has(currency.currencyId)
    );
  };

  const handleTagClick = (tag: string) => {
    let newFilteredReceipts: Receipt[] = [];

    if (selectedTag === tag) {
      setSelectedTag("전체");
      newFilteredReceipts =
        selectedCurrency === "전체"
          ? context.receipts
          : context.receipts.filter(
              (receipt: Receipt) => receipt.useCurrency === selectedCurrency
            );
    } else {
      newFilteredReceipts =
        selectedCurrency === "전체"
          ? context.receipts.filter(
              (receipt: Receipt) => receipt.useTag === tag
            )
          : context.receipts.filter(
              (receipt: Receipt) =>
                receipt.useTag === tag &&
                receipt.useCurrency === selectedCurrency
            );
      setSelectedTag(tag);
    }

    setFilteredReceipts(newFilteredReceipts);
  };

  const handleCurrencyClick = (currency: string) => {
    let newFilteredReceipts: Receipt[] = [];

    if (selectedCurrency === currency) {
      setSelectedCurrency("전체");
      newFilteredReceipts =
        selectedTag === "전체"
          ? context.receipts
          : context.receipts.filter(
              (receipt: Receipt) => receipt.useTag === selectedTag
            );
    } else {
      newFilteredReceipts =
        selectedTag === "전체"
          ? context.receipts.filter(
              (receipt: Receipt) => receipt.useCurrency === currency
            )
          : context.receipts.filter(
              (receipt: Receipt) =>
                receipt.useTag === selectedTag &&
                receipt.useCurrency === currency
            );
      setSelectedCurrency(currency);
    }

    setFilteredReceipts(newFilteredReceipts);
  };

  useEffect(() => {
    // 로딩 로직 추가
    context.setLoading(true);

    receiptApi
      .getReceipts(partyId!!)
      .then((response) => {
        // receipt를 변환하고 새로운 배열을 반환
        const transformedReceipts = response.data.map((receipt) => ({
          ...receipt,
          joins: JSON.parse(receipt.joins),
          createdAt: new Date(receipt.createdAt),
        }));
        // 변환된 배열을 상태에 저장

        context.setReceipts(transformedReceipts);

        currencyApi.getCurrencies().then((currencyResponse) => {
          const allCurrencies = currencyResponse.data.currencies;
          setCurrencies(getUsedCurrencies(transformedReceipts, allCurrencies));
        });

        const totalCostsByCurrency = calTotalCost(
          transformedReceipts,
          currencies
        );
        context.setTotalCostsByCurrency(totalCostsByCurrency);
      })
      .catch((err) => {
        console.log(err);
      });

    partyApi.getParty(partyId!!).then((response) => {
      context.setParty(response.data);
    });

    partyApi.getResult(partyId!!).then((response) => {
      setExchange(response.data.result);
    });

    tagApi.getTags().then((response) => {
      setTags(response.data.tags);
    });
    context.setLoading(false);
  }, []);

  useEffect(() => {
    console.log(exchange);
  }, [exchange]);

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

  useEffect(() => {
    const filterReceipts = () => {
      let displayedReceipts = context.receipts;

      if (selectedCurrency !== "전체") {
        displayedReceipts = context.receipts.filter(
          (receipt: any) => receipt.useCurrency === selectedCurrency
        );
      }

      if (selectedTag !== "전체") {
        displayedReceipts = displayedReceipts.filter(
          (receipt: any) => receipt.useTag === selectedTag
        );
      }

      setFilteredReceipts(displayedReceipts);
    };

    filterReceipts();
  }, [receipts, selectedCurrency, selectedTag]);

  return context.loading ? (
    <LoadingPresentation />
  ) : (
    <HistoryPresentation
      partyName={partyName}
      memberNames={memberNames}
      receipts={context.receipts}
      onBack={onBack}
      selectedTag={selectedTag}
      selectedCurrency={selectedCurrency}
      filteredReceipts={filteredReceipts}
      hasSelectedTag={hasSelectedTag}
      tags={tags}
      currencies={currencies}
      exchange={exchange}
      getCategoryReceipts={getCategoryReceipts}
      handleTagClick={handleTagClick}
      handleCurrencyClick={handleCurrencyClick}
      getReceiptsByCurrency={getReceiptsByCurrency}
      totalCostsByCurrency={context.totalCostsByCurrency}
      onStart={onStart}
      copyToClipboard={copyToClipboard}
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
