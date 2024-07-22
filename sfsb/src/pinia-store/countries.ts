import {defineStore} from "pinia";
import countryCodes from "./CountryCodes.json"

const useCountries = defineStore('countries', () => {
    const countries: CountryCode[] = countryCodes
    const getCountryByCode = (code: string): CountryCode | undefined => {
        const res = countries.find(country => country.code === code)
        return res
    }
    const getCountryByDialCode = (code: string): CountryCode | undefined => {
        const res = countries.find(country => country.dial_code === code)
        return res
    }
    return {
        countries,
        getCountryByCode,
        getCountryByDialCode
    }
})

export default useCountries

