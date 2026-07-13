export function buildWorkflow(store) {
  const hasAdminPassword = store.users.some(user => user.role === 'Administrator' && user.passwordHash);
  const hasClasses = store.classes.length > 0;
  const hasStudents = store.students.length > 0;
  const plannedExercise = store.exercises.find(exercise => ['geplant', 'freigegeben', 'laufend', 'abgeschlossen'].includes(exercise.status));
  const runningExercise = store.exercises.find(exercise => exercise.status === 'laufend');
  const snapshotReady = plannedExercise ? store.snapshots.some(snapshot => snapshot.exerciseId === plannedExercise.id) : false;
  const hasReports = plannedExercise ? store.attendanceReports.some(report => report.exerciseId === plannedExercise.id) : false;
  const hasSummary = store.exercises.some(exercise => exercise.status === 'abgeschlossen' && exercise.finalSummary);
  const steps = [
    { id: 'setup', label: 'Ersteinrichtung', description: 'Admin-Passwort setzen und anmelden.', done: hasAdminPassword, view: 'start' },
    { id: 'masterdata', label: 'Stammdaten', description: 'Klassen und Personen prüfen oder importieren.', done: hasClasses && hasStudents, view: 'masterdata' },
    { id: 'planning', label: 'Übung planen', description: 'Termin, Szenario, Gebäude und Sammelplätze festlegen.', done: Boolean(plannedExercise), view: 'planning' },
    { id: 'start', label: 'Übung starten', description: 'Übung aktivieren und Anwesenheits-Snapshot erzeugen.', done: Boolean(runningExercise) || snapshotReady, view: 'planning' },
    { id: 'mobile', label: 'Mobile Rückmeldungen', description: 'Klasse vollständig oder Abweichungen melden.', done: hasReports, view: 'mobile' },
    { id: 'dashboard', label: 'Lagebild prüfen', description: 'Fehlende Personen, Absenzen und Drucklisten prüfen.', done: snapshotReady, view: 'dashboard' },
    { id: 'close', label: 'Abschluss', description: 'Übung abschließen, Protokolle und Maßnahmen nachführen.', done: hasSummary, view: 'protocols' }
  ];
  const current = steps.find(step => !step.done) || steps.at(-1);
  return { currentStepId: current.id, progress: Math.round((steps.filter(step => step.done).length / steps.length) * 100), steps };
}
