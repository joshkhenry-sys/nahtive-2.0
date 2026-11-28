"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
type Question={prompt:string;options:string[];answer:string;explanation:string;rule:string;retry:string;retryAnswer:string};
export async function submitLessonAttempt(formData:FormData) {
 const supabase=await createClient();
 const {data:{user},error:userError}=await supabase.auth.getUser();
 if(userError||!user) throw new Error("Please sign in again.");
 const lessonId=String(formData.get("lessonId")??"");
 let answers:Record<string,string>={};
 try { answers=JSON.parse(String(formData.get("answers")??"{}")); } catch { throw new Error("Your answers could not be read."); }
 const production=String(formData.get("production")??"").trim();
 if(production.length<20) throw new Error("Write at least a few complete sentences before submitting.");
 const {data:lesson,error}=await supabase.from("lessons").select("id,content,points_reward,is_published").eq("id",lessonId).eq("is_published",true).single();
 if(error||!lesson) throw new Error("This lesson is not available.");
 const allQuestions:Question[]=(lesson.content.sections??[]).filter((s:any)=>s.type==="practice"||s.type==="assessment").flatMap((s:any)=>s.questions);
 const assessmentQuestions:Question[]=(lesson.content.sections??[]).filter((s:any)=>s.type==="assessment").flatMap((s:any)=>s.questions);
 if(!assessmentQuestions.length||allQuestions.some((q,i)=>!answers[String(i)])) throw new Error("Answer every question before submitting.");
 const feedback=allQuestions.map((q,i)=>({prompt:q.prompt,selected:answers[String(i)],correct:answers[String(i)]===q.answer,answer:q.answer,explanation:q.explanation,rule:q.rule,retry:q.retry,retryAnswer:q.retryAnswer}));
 const assessmentOffset=allQuestions.length-assessmentQuestions.length;
 const assessmentFeedback=feedback.slice(assessmentOffset);
 const correct=assessmentFeedback.filter(f=>f.correct).length; const score=Math.round(correct/assessmentQuestions.length*100); const passed=score>=80;
 const {error:attemptError}=await supabase.from("lesson_attempts").insert({user_id:user.id,lesson_id:lessonId,answers:{...answers,production},score,feedback});
 if(attemptError) throw new Error("We couldn't save your attempt. Please try again.");
 const {data:prior}=await supabase.from("lesson_progress").select("points_earned,attempts,best_score").eq("user_id",user.id).eq("lesson_id",lessonId).maybeSingle();
 const {error:progressError}=await supabase.from("lesson_progress").upsert({user_id:user.id,lesson_id:lessonId,status:passed?"completed":"in_progress",attempts:(prior?.attempts??0)+1,best_score:Math.max(Number(prior?.best_score??0),score),points_earned:prior?.points_earned??0,started_at:new Date().toISOString(),...(passed?{completed_at:new Date().toISOString()}:{}),last_activity_at:new Date().toISOString()},{onConflict:"user_id,lesson_id"});
 if(progressError) throw new Error("Your attempt was saved, but course progress could not be updated.");
 let points=0;
 if(passed&&!prior?.points_earned) {
  const {data:award,error:awardError}=await supabase.rpc("award_lesson_points",{p_lesson_id:lessonId});
  if(awardError) throw new Error("Lesson passed, but points could not be awarded.");
  points=Number(award??0);
  await supabase.from("lesson_progress").update({points_earned:points}).eq("user_id",user.id).eq("lesson_id",lessonId);
 }
 return {score,passed,points,feedback};
}
