import axiosInstance from "@/api/pistonApi"
import { Language, RunContext as RunContextType } from "@/types/run"
import langMap from "lang-map"
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import toast from "react-hot-toast"
import { useFileSystem } from "./FileContext"

const RunCodeContext = createContext<RunContextType | null>(null)
const PUBLIC_PISTON_API_URL = "https://emkc.org/api/v2/piston"
const DEFAULT_SUPPORTED_LANGUAGES: Language[] = [
    { language: "javascript", version: "", aliases: ["js", "node"] },
    { language: "python", version: "", aliases: ["py", "python3"] },
    { language: "typescript", version: "", aliases: ["ts"] },
    { language: "java", version: "", aliases: [] },
    { language: "cpp", version: "", aliases: ["cc", "c++"] },
    { language: "c", version: "", aliases: [] },
]
const DEFAULT_SELECTED_LANGUAGE = DEFAULT_SUPPORTED_LANGUAGES[0]

export const useRunCode = () => {
    const context = useContext(RunCodeContext)
    if (context === null) {
        throw new Error(
            "useRunCode must be used within a RunCodeContextProvider",
        )
    }
    return context
}

const RunCodeContextProvider = ({ children }: { children: ReactNode }) => {
    const { activeFile } = useFileSystem()
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [supportedLanguages, setSupportedLanguages] = useState<Language[]>(
        DEFAULT_SUPPORTED_LANGUAGES,
    )
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(
        DEFAULT_SELECTED_LANGUAGE,
    )

    useEffect(() => {
        const fetchSupportedLanguages = async () => {
            setSupportedLanguages(DEFAULT_SUPPORTED_LANGUAGES)

            try {
                const languages = await axiosInstance.get("/runtimes")
                if (languages.data.length > 0) {
                    setSupportedLanguages(languages.data)
                    return
                }

                toast.error(
                    "No Piston runtimes installed. Install a runtime before running code.",
                )
            } catch (error: any) {
                try {
                    const languages = await fetch(
                        `${PUBLIC_PISTON_API_URL}/runtimes`,
                    )
                    if (!languages.ok) throw new Error(languages.statusText)
                    const fallbackLanguages = await languages.json()
                    if (fallbackLanguages.length > 0) {
                        setSupportedLanguages(fallbackLanguages)
                        return
                    }
                } catch (fallbackError: any) {
                    toast.error(
                        "Using default languages. Start local Piston to run code.",
                    )
                    console.error(
                        fallbackError?.message ||
                            error?.message ||
                            "Failed to fetch supported languages",
                    )
                }
            }
        }

        fetchSupportedLanguages()
    }, [])

    // Set the selected language based on the file extension
    useEffect(() => {
        if (supportedLanguages.length === 0 || !activeFile?.name) return

        const extension = activeFile.name.split(".").pop()
        if (extension) {
            const languageName = langMap.languages(extension)
            const language = supportedLanguages.find(
                (lang) =>
                    lang.aliases.includes(extension) ||
                    languageName.includes(lang.language.toLowerCase()),
            )
            if (language) setSelectedLanguage(language)
        } else setSelectedLanguage({ language: "", version: "", aliases: [] })
    }, [activeFile?.name, supportedLanguages])

    const runCode = async () => {
        try {
            if (!selectedLanguage.language || !selectedLanguage.version) {
                setOutput(
                    "No runnable Piston version is available for this language. Install runtimes in local Piston first.",
                )
                return toast.error("No runnable language version available")
            } else if (!activeFile) {
                return toast.error("Please open a file to run the code")
            } else {
                toast.loading("Running code...")
            }

            setIsRunning(true)
            const { language, version } = selectedLanguage

            const response = await axiosInstance.post("/execute", {
                language,
                version,
                files: [{ name: activeFile.name, content: activeFile.content }],
                stdin: input,
            })
            if (response.data.run.stderr) {
                setOutput(response.data.run.stderr)
            } else {
                setOutput(response.data.run.stdout)
            }
            setIsRunning(false)
            toast.dismiss()
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Failed to run the code"

            console.error(errorMessage)
            setOutput(errorMessage)
            setIsRunning(false)
            toast.dismiss()
            toast.error("Failed to run the code")
        }
    }

    return (
        <RunCodeContext.Provider
            value={{
                setInput,
                output,
                isRunning,
                supportedLanguages,
                selectedLanguage,
                setSelectedLanguage,
                runCode,
            }}
        >
            {children}
        </RunCodeContext.Provider>
    )
}

export { RunCodeContextProvider }
export default RunCodeContext
