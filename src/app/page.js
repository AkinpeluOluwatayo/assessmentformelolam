"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase";

export default function AssessmentForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
        subject: "New Child Assessment Submission",
        childName: "", age: "", sex: "", diagnosis: "", positionInFamily: "",
        schoolAttended: "", class: "", parentName: "", phone: "", homeAddress: "", officeAddress: "",
        expectations: "", gestation: "", deliveryType: "", criesAtBirth: "", birthWeight: "",
        neckControl: "", sitting: "", crawling: "", walking: "", languageDev: "",
        hearingTest: "", onMedication: "", medicationDetails: "", seizures: "",
        hurtfulToSelf: "", hurtfulToOthers: "",
        tactileSensitivity: "", tasteSmellSensitivity: "", movementSensitivity: "",
        underresponsiveSeeking: "", auditoryFiltering: "", energyLevel: "", visualAuditory: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Save to Web3Forms
            const web3Res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(formData),
            });
            const web3Data = await web3Res.json();
            if (!web3Data.success) {
                console.error("Web3Forms failed:", web3Data);
            }

            // Step 2: Save to Supabase
            const { error: supabaseError } = await supabase
                .from("children")
                .insert([
                    {
                        full_name: formData.childName,
                        diagnosis: formData.diagnosis,
                        position_in_family: formData.positionInFamily,
                        expectations_goals: formData.expectations,
                        gestation_period: formData.gestation,
                        delivery_type: formData.deliveryType,
                        cries_at_birth: formData.criesAtBirth,
                        birth_weight: formData.birthWeight,
                        milestones: {
                            neckControl: formData.neckControl,
                            sitting: formData.sitting,
                            crawling: formData.crawling,
                            walking: formData.walking,
                            languageDev: formData.languageDev,
                        },
                        hearing_test_conducted: formData.hearingTest,
                        seizures_frequency: formData.seizures,
                        behavioral_issues: {
                            hurtfulToSelf: formData.hurtfulToSelf,
                            hurtfulToOthers: formData.hurtfulToOthers,
                        },
                        sensory_profile: {
                            tactileSensitivity: formData.tactileSensitivity,
                            tasteSmellSensitivity: formData.tasteSmellSensitivity,
                            movementSensitivity: formData.movementSensitivity,
                            underresponsiveSeeking: formData.underresponsiveSeeking,
                            auditoryFiltering: formData.auditoryFiltering,
                            energyLevel: formData.energyLevel,
                            visualAuditory: formData.visualAuditory,
                        },
                    },
                ]);

            if (supabaseError) {
                throw supabaseError;
            }

            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Submission failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ title, subtitle }) => (
        <div className="mb-6 border-l-4 border-blue-600 pl-4">
            <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm font-bold text-slate-500">{subtitle}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                <div className="bg-blue-600 p-8 text-center text-white">
                    <h1 className="text-2xl font-black mb-1">EL-OLAM SPECIAL HOME AND REHABILITATION CENTRE</h1>
                    <p className="text-blue-100 text-sm font-black tracking-widest">CAC/IT NO: 156872</p>
                    <div className="mt-6 flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? "bg-white" : "bg-blue-400 opacity-30"}`} />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <SectionHeader title="1.0 Basic Information" subtitle="Child and Guardian Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Child's Name" name="childName" placeholder="ENTER CHILD'S NAME" value={formData.childName} onChange={handleChange} />
                                <Input label="Age" name="age" placeholder="ENTER AGE" value={formData.age} onChange={handleChange} />
                                <Select label="Sex" name="sex" options={["Male", "Female"]} value={formData.sex} onChange={handleChange} />
                                <Input label="Diagnosis" name="diagnosis" placeholder="ENTER DIAGNOSIS" value={formData.diagnosis} onChange={handleChange} />
                            </div>
                            <Input label="Position in Family" name="positionInFamily" placeholder="e.g. 1st child" value={formData.positionInFamily} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="School Attended" name="schoolAttended" placeholder="NAME OF SCHOOL" value={formData.schoolAttended} onChange={handleChange} />
                                <Input label="Class" name="class" placeholder="CURRENT CLASS" value={formData.class} onChange={handleChange} />
                            </div>
                            <hr className="my-4 border-slate-200" />
                            <Input label="Parent/Guardian Name" name="parentName" placeholder="ENTER GUARDIAN NAME" value={formData.parentName} onChange={handleChange} />
                            <Input label="Phone Number" name="phone" placeholder="PHONE NUMBER" value={formData.phone} onChange={handleChange} />
                            <TextArea label="Home Address" name="homeAddress" placeholder="FULL RESIDENTIAL ADDRESS" value={formData.homeAddress} onChange={handleChange} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <SectionHeader title="2.0 Referral & Development" subtitle="Reason for referral and birth history" />
                            <TextArea label="Expectations (What do you hope to achieve?)" name="expectations" placeholder="YOUR GOALS FOR THE CHILD" value={formData.expectations} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Select label="Gestation Period" name="gestation" options={["Normal", "Premature", "Post-term"]} value={formData.gestation} onChange={handleChange} />
                                <Select label="Delivery Type" name="deliveryType" options={["Normal", "Caesarian Section"]} value={formData.deliveryType} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Select label="Cries at Birth?" name="criesAtBirth" options={["Yes", "No"]} value={formData.criesAtBirth} onChange={handleChange} />
                                <Input label="Birth Weight" name="birthWeight" placeholder="e.g. 3.5kg" value={formData.birthWeight} onChange={handleChange} />
                            </div>
                            <p className="font-black text-blue-900 mt-4 uppercase text-xs tracking-wider">Developmental Milestones (Age achieved):</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Input label="Neck Control" name="neckControl" placeholder="e.g. 4 months" value={formData.neckControl} onChange={handleChange} />
                                <Input label="Sitting" name="sitting" placeholder="AGE" value={formData.sitting} onChange={handleChange} />
                                <Input label="Crawling" name="crawling" placeholder="AGE" value={formData.crawling} onChange={handleChange} />
                                <Input label="Walking" name="walking" placeholder="AGE" value={formData.walking} onChange={handleChange} />
                                <Input label="Language" name="languageDev" placeholder="AGE" value={formData.languageDev} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <SectionHeader title="3.0 Medical & Behavioral" subtitle="Health history and behavioral observations" />
                            <Select label="Had hearing test conducted?" name="hearingTest" options={["Yes", "No"]} value={formData.hearingTest} onChange={handleChange} />
                            <Select label="Is your child on medication?" name="onMedication" options={["Yes", "No"]} value={formData.onMedication} onChange={handleChange} />
                            {formData.onMedication === "Yes" && <Input label="Please state medication" name="medicationDetails" placeholder="NAME OF DRUGS" value={formData.medicationDetails} onChange={handleChange} />}
                            <Input label="Seizures (If yes, how often?)" name="seizures" placeholder="FREQUENCY" value={formData.seizures} onChange={handleChange} />
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="font-black text-blue-900 mb-2 uppercase text-xs">Behavioural Issues:</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select label="Hurtful to him/herself?" name="hurtfulToSelf" options={["Nil", "Occasionally", "Frequently"]} value={formData.hurtfulToSelf} onChange={handleChange} />
                                    <Select label="Hurtful to others?" name="hurtfulToOthers" options={["Nil", "Occasionally", "Frequently"]} value={formData.hurtfulToOthers} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <SectionHeader title="4.0 Sensory Profile (A)" subtitle="Tactile, Taste, and Movement" />
                            <Select label="Tactile Sensitivity" name="tactileSensitivity" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.tactileSensitivity} onChange={handleChange} />
                            <Select label="Taste/Smell Sensitivity" name="tasteSmellSensitivity" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.tasteSmellSensitivity} onChange={handleChange} />
                            <Select label="Movement Sensitivity" name="movementSensitivity" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.movementSensitivity} onChange={handleChange} />
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md text-amber-800 text-sm font-bold italic">
                                Note: These observations help our specialists design the most accurate therapy program for your child.
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <SectionHeader title="5.0 Sensory Profile (B)" subtitle="Final sections and submission" />
                            <Select label="Underresponsive / Seeks Sensation" name="underresponsiveSeeking" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.underresponsiveSeeking} onChange={handleChange} />
                            <Select label="Auditory Filtering" name="auditoryFiltering" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.auditoryFiltering} onChange={handleChange} />
                            <Select label="Low Energy / Weak" name="energyLevel" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.energyLevel} onChange={handleChange} />
                            <Select label="Visual/Auditory Sensitivity" name="visualAuditory" options={["Typical", "Probable Difference", "Definite Difference"]} value={formData.visualAuditory} onChange={handleChange} />
                            <div className="mt-8 p-6 bg-blue-900 rounded-xl text-white">
                                <p className="text-center font-black italic uppercase tracking-tight">"I hereby attest to the accuracy of the information obtained in this application."</p>
                            </div>
                        </div>
                    )}

                    {submitted && (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-700 text-center py-12">
                            <SectionHeader title="Submission Successful" subtitle="Thank you for the assessment" />
                            <div className="bg-green-50 p-6 rounded-xl border-2 border-dashed border-green-200">
                                <p className="text-green-900 font-bold">
                                    The assessment data has been recorded in our system.
                                </p>
                            </div>
                            <button type="button" onClick={() => window.location.reload()} className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                                START NEW ASSESSMENT
                            </button>
                        </div>
                    )}

                    {step <= 5 && !submitted && (
                        <div className="mt-10 flex justify-between gap-4">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="flex-1 py-3 px-6 rounded-xl border-2 border-blue-600 text-blue-600 font-black hover:bg-blue-50 transition-colors">
                                    ← BACK
                                </button>
                            )}
                            {step < 5 ? (
                                <button type="button" onClick={nextStep} className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                                    NEXT STEP →
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="flex-1 py-3 px-6 rounded-xl bg-green-600 text-white font-black hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:opacity-50">
                                    {loading ? "SUBMITTING..." : "SUBMIT ASSESSMENT ✓"}
                                </button>
                            )}
                        </div>
                    )}
                </form>

                <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">EO</div>
                        <span className="text-xs text-slate-500 font-black">EL-OLAM REHAB CENTRE</span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© 2026 Powered by Elroi Technologies</p>
                </div>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">{label}</label>
            <input className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all text-black font-black placeholder:text-slate-600 placeholder:font-black bg-white" {...props} />
        </div>
    );
}

function TextArea({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">{label}</label>
            <textarea rows={3} className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all text-black font-black placeholder:text-slate-600 placeholder:font-black bg-white" {...props} />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-1">{label}</label>
            <select className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all text-black font-black" {...props}>
                <option value="" className="text-slate-400">SELECT OPTION</option>
                {options.map((opt) => (
                    <option key={opt} value={opt} className="text-black font-black uppercase">{opt}</option>
                ))}
            </select>
        </div>
    );
}