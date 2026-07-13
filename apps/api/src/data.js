import crypto from 'node:crypto';

export const permissions = {
  Administrator:['school:manage','users:manage','roles:manage','imports:run','exercises:manage','exercises:approve','attendance:report','dashboard:view','documents:manage','surveys:manage','calendar:manage','actions:manage','audit:view','sensitive:view'],
  Sicherheitsbeauftragter:['exercises:manage','attendance:report','dashboard:view','documents:manage','surveys:manage','calendar:manage','actions:manage'],
  Schulleitung:['exercises:approve','dashboard:view','reports:view','actions:manage'],
  Lehrkraft:['attendance:report','mobile:view','feedback:create'],
  Sekretariat:['imports:run','attendance:print','dashboard:view'],
  Beobachter:['observations:create','mobile:view']
};
export const store={
  school:{name:'Demo-Gesamtschule am Park',code:'meine-schule',infoportalUrl:'https://schule-infoportal.de/login/meine-schule',year:'2026/2027'},
  users:[{id:'u-admin',name:'Admin Demo',email:'admin@demo.schule',role:'Administrator'},{id:'u-safety',name:'Sina Sicherheit',email:'sicherheit@demo.schule',role:'Sicherheitsbeauftragter'},{id:'u-head',name:'Heike Leitung',email:'leitung@demo.schule',role:'Schulleitung'},{id:'u-teacher',name:'Lena Lehrkraft',email:'lehrkraft@demo.schule',role:'Lehrkraft'}],
  buildings:[{id:'b1',name:'Hauptgebäude'},{id:'b2',name:'Sporthalle'}],
  assemblyPoints:[{id:'sp1',name:'Sammelplatz A - Sportplatz'},{id:'sp2',name:'Sammelplatz B - Parkplatz'}],
  classes:[{id:'c7a',name:'7A',teacherId:'u-teacher',assemblyPointId:'sp1'},{id:'c8b',name:'8B',teacherId:'u-teacher',assemblyPointId:'sp2'}],
  students:[{id:'s1',firstName:'Mila',lastName:'Beispiel',classId:'c7a'},{id:'s2',firstName:'Noah',lastName:'Muster',classId:'c7a',supportNeed:'Begleitung Treppe'},{id:'s3',firstName:'Emma',lastName:'Demo',classId:'c8b'}],
  absences:[{personId:'s3',reason:'krank',date:'2026-07-13'}],
  exercises:[{id:'ex1',title:'Probealarm Sprint 1',type:'Probealarm',date:'2026-07-13',status:'laufend',buildings:['b1'],assemblyPoints:['sp1','sp2'],approvedBy:'u-head',startedAt:'2026-07-13T09:00:00.000Z'}],
  snapshots:[], attendanceReports:[], emergencyReports:[], tasks:[], documents:[], surveys:[], calendar:[], actions:[], audit:[]
};
export function audit(user,action,entity,details={}){store.audit.push({id:crypto.randomUUID(),at:new Date().toISOString(),user,action,entity,details});}
export function normalizeInfoportal(input){ if(!input) return ''; if(input.startsWith('https://schule-infoportal.de/login/')) return input; const code=input.replace(/^\/+|\/+$/g,''); return `https://schule-infoportal.de/login/${encodeURIComponent(code)}`; }
export function createSnapshot(exerciseId){ const ex=store.exercises.find(e=>e.id===exerciseId); if(!ex) throw new Error('Übung nicht gefunden'); if(store.snapshots.some(s=>s.exerciseId===exerciseId)) return store.snapshots.filter(s=>s.exerciseId===exerciseId); const now=new Date().toISOString(); const rows=store.students.map(st=>{ const klass=store.classes.find(c=>c.id===st.classId); const absence=store.absences.find(a=>a.personId===st.id && a.date===ex.date); return {id:crypto.randomUUID(),exerciseId,timestamp:now,source:'DemoProvider/CSV-Import',personId:st.id,personName:`${st.firstName} ${st.lastName}`,group:klass?.name,expectedTeacherId:klass?.teacherId,expectedRoom:'laut Stundenplan',assemblyPointId:klass?.assemblyPointId,absenceStatus:absence?.reason||'erwartet',lastSync:now,supportNeed:st.supportNeed}; }); store.snapshots.push(...rows); audit('system','snapshot.created','exercise',{exerciseId,count:rows.length}); return rows; }
export function dashboard(exerciseId){ const snap=store.snapshots.filter(s=>s.exerciseId===exerciseId); const reports=store.attendanceReports.filter(r=>r.exerciseId===exerciseId); const presentIds=new Set(reports.flatMap(r=>r.presentPersonIds||[])); const missing=snap.filter(s=>s.absenceStatus==='erwartet'&&!presentIds.has(s.personId)); return {expectedTotal:snap.filter(s=>s.absenceStatus==='erwartet').length,reportedTotal:presentIds.size,knownAbsences:snap.filter(s=>s.absenceStatus!=='erwartet'),missing,additional:reports.flatMap(r=>r.additionalPersons||[]),injured:store.emergencyReports.filter(r=>r.type==='verletzte Person'),completeClasses:reports.filter(r=>r.status==='vollständig').map(r=>r.group),openEmergencyReports:store.emergencyReports.filter(r=>!r.closedAt),firstReportAt:reports[0]?.submittedAt,lastReportAt:reports.at(-1)?.submittedAt}; }
export const formTemplates=['Planung eines Probealarms','Vorbereitungscheckliste','Freigabe durch die Schulleitung','Alarmierungsprotokoll','Beobachtungsprotokoll','Räumungsprotokoll','Sammelplatzprotokoll','Anwesenheitsabgleich','Meldung vermisster Personen','Mängelprotokoll','Maßnahmenplan','Abschlussbericht'];
