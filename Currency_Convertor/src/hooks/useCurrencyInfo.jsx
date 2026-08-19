import axios from "axios";
import { useEffect, useState } from "react";

// Custom Hook
function useCurrencyInfo(currency) {

    const [dataValue, setDataValue] = useState({});

    useEffect(() => {

        const fetchData = async () => {

            const { data } = await axios.get(
                `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
            );

            setDataValue(data[currency]);

        };

        fetchData();

    }, [currency]);

    return dataValue;
}

export default useCurrencyInfo;