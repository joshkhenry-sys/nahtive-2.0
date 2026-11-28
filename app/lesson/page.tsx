import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonPlayer from "./lesson-player";

export const dynamic = "force-dynamic";

export default async function LessonPage({searchParams}:{searchParams:Promise<{slug?:string}>}) {
  const {slug}=await searchParams;
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:profile}=await supabase.from("learner_languages").select("starting_level,language_id").eq("user_id",user.id).eq("is_current",true).maybeSingle();
  if(!profile?.starting_level) redirect("/onboarding");
  const {data:course}=await supabase.from("courses").select("id,title,level").eq("language_id",profile.language_id).eq("level",profile.starting_level).maybeSingle();
  if(!course) redirect("/dashboard");
  const {data:units}=await supabase.from("course_units").select("id,title,sequence").eq("course_id",course.id).eq("is_published",true).order("sequence");
  if(!units?.length) redirect("/dashboard");
  const {data:lessons}=await supabase.from("lessons").select("id,slug,title,description,sequence,estimated_minutes,points_reward,content").in("unit_id",units.map(u=>u.id)).eq("is_published",true).order("sequence");
  if(!lessons?.length) redirect("/dashboard");
  const active=lessons.find(l=>l.slug===slug) ?? lessons[0];
  const {data:progress}=await supabase.from("lesson_progress").select("lesson_id,status,best_score,completed_at").eq("user_id",user.id).in("lesson_id",lessons.map(l=>l.id));
  const completed=new Set((progress??[]).filter(p=>p.status==="completed").map(p=>p.lesson_id));
  const currentIndex=lessons.findIndex(l=>l.id===active.id);
  const unlocked=lessons.findIndex(l=>!completed.has(l.id));
  const allowedIndex=unlocked===-1?lessons.length-1:unlocked;
  if(currentIndex>allowedIndex) redirect("/lesson?slug="+lessons[allowedIndex].slug);
  return <LessonPlayer lesson={active} lessons={lessons.map(l=>({id:l.id,slug:l.slug,title:l.title,sequence:l.sequence,completed:completed.has(l.id)}))} courseTitle={course.title} level={course.level} />;
}
