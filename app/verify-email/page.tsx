"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import OTPInput from "@/components/OTPInput"
import { authAPI } from "@/lib/api"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get("email") || ""
    const role = searchParams.get("role") || ""

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        if (!email) {
            toast.error("Email is required for verification", { position: "top-right" })
            router.push("/signup")
            return
        }
    }, [email, router])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleVerify = async () => {
        const otpCode = otp.join("")

        if (otpCode.length !== 6) {
            toast.error("Please enter the complete 6-digit OTP", {
                position: "top-right",
                autoClose: 3000,
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await authAPI.verifyEmail(email, otpCode)

            if (response.success) {
                // Redirect directly to the correct login page based on the registered role
                const loginPath =
                    role === 'management' ? '/management/login' :
                    role === 'other'       ? '/other/login' :
                    role === 'inspector'   ? '/login?role=inspector' :
                    '/profile-selection'

                toast.success("Email verified successfully! Redirecting to login...", {
                    position: "top-right",
                    autoClose: 2000,
                })
                setTimeout(() => router.push(loginPath), 2000)
            } else {
                toast.error(response.message || "Invalid OTP", {
                    position: "top-right",
                    autoClose: 3000,
                })
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to verify email", {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (!canResend) return

        setIsLoading(true)

        try {
            await authAPI.resendVerificationOTP(email)
            toast.success("A new OTP has been sent to your email", {
                position: "top-right",
                autoClose: 3000,
            })
            setCountdown(60)
            setCanResend(false)
            setOtp(["", "", "", "", "", ""])
        } catch (error: any) {
            toast.error(error.message || "Failed to resend OTP", {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSkip = () => {
        toast.info("You can verify your email later from settings.", {
            position: "top-right",
            autoClose: 3000,
        })
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header Section */}
            <div
                className="w-full bg-[#E8F4F8] px-6 text-center flex flex-col items-center justify-center rounded-b-[70px]"
                style={{ height: "280px" }}
            >
                <div className="flex justify-center mb-8">
                    <Image
                        src="/logo.png"
                        alt="INSPIRE Logo"
                        width={480}
                        height={560}
                        className="w-auto h-24 md:h-32 lg:h-36 cursor-pointer"
                        onClick={() => router.push("/")}
                    />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Verify Your Email
                </h1>
                <p className="text-sm md:text-base text-gray-600 px-4">
                    We've sent a 6-digit verification code to:
                </p>
                <p className="text-sm md:text-base font-semibold text-gray-900 mt-1">
                    {email}
                </p>
            </div>

            {/* Form Section */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-[600px] px-6 md:px-12 py-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
                        Enter Verification Code
                    </h2>

                    <div className="space-y-6">
                        {/* OTP Input */}
                        <div>
                            <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={handleVerify}
                            disabled={isLoading}
                            className="w-full bg-[#006795] hover:bg-[#006795]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
                        >
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </Button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{" "}
                                {canResend ? (
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer disabled:opacity-50"
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <span className="text-gray-500">
                                        Resend in {countdown}s
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Skip for now */}
                        <div className="text-center">
                            <button
                                onClick={handleSkip}
                                className="text-gray-500 hover:underline text-sm bg-transparent border-0 cursor-pointer"
                            >
                                Skip for now (verify later)
                            </button>
                        </div>

                        {/* Back to Sign In */}
                        <div className="text-center">
                            <button
                                onClick={() => router.push("/login")}
                                className="text-[#006795] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                            >
                                ← Back to Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
