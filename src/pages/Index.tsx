import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  color: string;
}

const Index = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      subject: 'Математика',
      teacher: 'Иванова А.П.',
      room: 'Каб. 205',
      startTime: '09:00',
      endTime: '10:30',
      dayOfWeek: 1,
      color: 'bg-blue-500',
    },
    {
      id: '2',
      subject: 'Физика',
      teacher: 'Петров С.В.',
      room: 'Каб. 312',
      startTime: '10:45',
      endTime: '12:15',
      dayOfWeek: 1,
      color: 'bg-purple-500',
    },
    {
      id: '3',
      subject: 'История',
      teacher: 'Сидорова М.И.',
      room: 'Каб. 108',
      startTime: '09:00',
      endTime: '10:30',
      dayOfWeek: 2,
      color: 'bg-amber-500',
    },
    {
      id: '4',
      subject: 'Английский язык',
      teacher: 'Козлов Д.А.',
      room: 'Каб. 401',
      startTime: '13:00',
      endTime: '14:30',
      dayOfWeek: 1,
      color: 'bg-green-500',
    },
  ]);

  const [newLesson, setNewLesson] = useState({
    subject: '',
    teacher: '',
    room: '',
    startTime: '',
    endTime: '',
    dayOfWeek: 1,
  });

  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];

  const handleAddLesson = () => {
    if (!newLesson.subject || !newLesson.startTime || !newLesson.endTime) {
      toast.error('Заполните обязательные поля');
      return;
    }

    const lesson: Lesson = {
      id: Date.now().toString(),
      ...newLesson,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setLessons([...lessons, lesson]);
    setNewLesson({
      subject: '',
      teacher: '',
      room: '',
      startTime: '',
      endTime: '',
      dayOfWeek: 1,
    });
    setIsDialogOpen(false);
    toast.success('Занятие добавлено!');
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
    toast.success('Занятие удалено');
  };

  const getLessonsForDay = (day: number) => {
    return lessons
      .filter(lesson => lesson.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTodayLessons = () => {
    const today = new Date().getDay();
    const adjustedDay = today === 0 ? 7 : today;
    return getLessonsForDay(adjustedDay);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-900">Расписание Занятий</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  <Icon name="Plus" size={20} />
                  Добавить занятие
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Новое занятие</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о занятии
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Предмет *</Label>
                    <Input
                      id="subject"
                      value={newLesson.subject}
                      onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                      placeholder="Математика"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Преподаватель</Label>
                    <Input
                      id="teacher"
                      value={newLesson.teacher}
                      onChange={(e) => setNewLesson({ ...newLesson, teacher: e.target.value })}
                      placeholder="Иванов И.И."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Аудитория</Label>
                    <Input
                      id="room"
                      value={newLesson.room}
                      onChange={(e) => setNewLesson({ ...newLesson, room: e.target.value })}
                      placeholder="Каб. 205"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Начало *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newLesson.startTime}
                        onChange={(e) => setNewLesson({ ...newLesson, startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Конец *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newLesson.endTime}
                        onChange={(e) => setNewLesson({ ...newLesson, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">День недели</Label>
                    <select
                      id="dayOfWeek"
                      value={newLesson.dayOfWeek}
                      onChange={(e) => setNewLesson({ ...newLesson, dayOfWeek: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={index} value={index + 1}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleAddLesson} className="flex-1">
                    <Icon name="Check" size={18} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Отмена
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-slate-600">Управляйте расписанием занятий легко и удобно</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8 animate-fade-in">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Сегодня</CardTitle>
              <Icon name="Calendar" size={20} className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{getTodayLessons().length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {getTodayLessons().length > 0 ? 'занятий запланировано' : 'занятий нет'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">На неделе</CardTitle>
              <Icon name="BookOpen" size={20} className="text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{lessons.length}</div>
              <p className="text-xs text-slate-500 mt-1">всего занятий</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Режим</CardTitle>
              <Icon name="LayoutGrid" size={20} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="flex-1"
                >
                  День
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="flex-1"
                >
                  Неделя
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="CalendarDays" size={28} className="text-primary" />
              Расписание
            </CardTitle>
            <CardDescription>
              {viewMode === 'week' ? 'Недельное расписание занятий' : 'Расписание на день'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === 'week' ? (
              <div className="space-y-6">
                {daysOfWeek.slice(0, 5).map((day, index) => {
                  const dayLessons = getLessonsForDay(index + 1);
                  return (
                    <div key={index} className="border-l-4 border-primary pl-4 hover:bg-slate-50 transition-colors rounded-r-lg py-2">
                      <h3 className="font-semibold text-lg mb-3 text-slate-900">{day}</h3>
                      {dayLessons.length === 0 ? (
                        <p className="text-slate-400 text-sm">Занятий не запланировано</p>
                      ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                          {dayLessons.map((lesson) => (
                            <Card
                              key={lesson.id}
                              className="group hover:shadow-md transition-all cursor-pointer border-l-4"
                              style={{ borderLeftColor: lesson.color.replace('bg-', '') }}
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900">{lesson.subject}</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                      <Icon name="Clock" size={14} />
                                      {lesson.startTime} - {lesson.endTime}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Icon name="Trash2" size={16} className="text-red-500" />
                                  </Button>
                                </div>
                                <div className="space-y-1 mt-3">
                                  {lesson.teacher && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                      <Icon name="User" size={14} />
                                      {lesson.teacher}
                                    </div>
                                  )}
                                  {lesson.room && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                      <Icon name="MapPin" size={14} />
                                      {lesson.room}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {getTodayLessons().length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="CalendarX" size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">На сегодня занятий нет</p>
                  </div>
                ) : (
                  getTodayLessons().map((lesson) => (
                    <Card key={lesson.id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: lesson.color.replace('bg-', '') }}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-xl text-slate-900 mb-2">{lesson.subject}</h4>
                            <div className="flex flex-wrap gap-3">
                              <Badge variant="secondary" className="gap-1">
                                <Icon name="Clock" size={14} />
                                {lesson.startTime} - {lesson.endTime}
                              </Badge>
                              {lesson.teacher && (
                                <Badge variant="outline" className="gap-1">
                                  <Icon name="User" size={14} />
                                  {lesson.teacher}
                                </Badge>
                              )}
                              {lesson.room && (
                                <Badge variant="outline" className="gap-1">
                                  <Icon name="MapPin" size={14} />
                                  {lesson.room}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Icon name="Trash2" size={18} className="text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
