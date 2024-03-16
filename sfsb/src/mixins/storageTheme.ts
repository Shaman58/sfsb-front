const useStorageTheme = ()=>{

const lightOn = (cb?: ()=>any)=>{
    window.localStorage.setItem("theme","light")
    cb && cb()
}
const darkOn = (cb?: ()=>any)=>{
    window.localStorage.setItem("theme","dark")
    cb && cb()
}
const autoOn = (cb?: ()=>any)=>{
    window.localStorage.setItem("theme","auto")
    cb && cb()
}

return {lightOn, darkOn, autoOn}

}

export default useStorageTheme
