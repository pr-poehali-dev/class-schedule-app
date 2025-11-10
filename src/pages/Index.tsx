import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
      color: '#3b82f6',
    },
    {
      id: '2',
      subject: 'Физика',
      teacher: 'Петров С.В.',
      room: 'Каб. 312',
      startTime: '10:45',
      endTime: '12:15',
      dayOfWeek: 1,
      color: '#a855f7',
    },
    {
      id: '3',
      subject: 'История',
      teacher: 'Сидорова М.И.',
      room: 'Каб. 108',
      startTime: '09:00',
      endTime: '10:30',
      dayOfWeek: 2,
      color: '#f59e0b',
    },
    {
      id: '4',
      subject: 'Английский язык',
      teacher: 'Козлов Д.А.',
      room: 'Каб. 401',
      startTime: '13:00',
      endTime: '14:30',
      dayOfWeek: 1,
      color: '#10b981',
    },
    {
      id: '5',
      subject: 'Литература',
      teacher: 'Морозова Е.С.',
      room: 'Каб. 210',
      startTime: '14:45',
      endTime: '16:15',
      dayOfWeek: 2,
      color: '#ec4899',
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

  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 1 : today;
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const daysOfWeekFull = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const colors = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

  const handleAddLesson = () => {
    if (!newLesson.subject || !newLesson.startTime || !newLesson.endTime) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (editingLesson) {
      setLessons(lessons.map(l => 
        l.id === editingLesson.id 
          ? { ...l, ...newLesson }
          : l
      ));
      toast.success('Занятие обновлено!');
      setEditingLesson(null);
    } else {
      const lesson: Lesson = {
        id: Date.now().toString(),
        ...newLesson,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setLessons([...lessons, lesson]);
      toast.success('Занятие добавлено!');
    }

    setNewLesson({
      subject: '',
      teacher: '',
      room: '',
      startTime: '',
      endTime: '',
      dayOfWeek: selectedDay,
    });
    setIsSheetOpen(false);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setNewLesson({
      subject: lesson.subject,
      teacher: lesson.teacher,
      room: lesson.room,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      dayOfWeek: lesson.dayOfWeek,
    });
    setIsSheetOpen(true);
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

  const dayLessons = getLessonsForDay(selectedDay);

  const formatDate = () => {
    const date = new Date();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const calculateBreak = (endTime: string, startTime: string): string => {
    const [endHour, endMin] = endTime.split(':').map(Number);
    const [startHour, startMin] = startTime.split(':').map(Number);
    
    const endMinutes = endHour * 60 + endMin;
    const startMinutes = startHour * 60 + startMin;
    const breakMinutes = startMinutes - endMinutes;
    
    if (breakMinutes < 60) {
      return `${breakMinutes} мин`;
    }
    const hours = Math.floor(breakMinutes / 60);
    const minutes = breakMinutes % 60;
    return minutes > 0 ? `${hours} ч ${minutes} мин` : `${hours} ч`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Расписание</h1>
              <p className="text-sm text-slate-500">{formatDate()}</p>
            </div>
            <Button
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={() => {
                setEditingLesson(null);
                setNewLesson({
                  subject: '',
                  teacher: '',
                  room: '',
                  startTime: '',
                  endTime: '',
                  dayOfWeek: selectedDay,
                });
                setIsSheetOpen(true);
              }}
            >
              <Icon name="Plus" size={24} />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {daysOfWeek.map((day, index) => {
              const dayNumber = index + 1;
              const lessonsCount = getLessonsForDay(dayNumber).length;
              const isToday = dayNumber === new Date().getDay() || (new Date().getDay() === 0 && dayNumber === 7);
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(dayNumber)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all ${
                    selectedDay === dayNumber
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {lessonsCount > 0 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      selectedDay === dayNumber ? 'bg-white' : 'bg-primary'
                    }`} />
                  )}
                  {isToday && selectedDay !== dayNumber && (
                    <div className="w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            {daysOfWeekFull[selectedDay - 1]}
          </h2>
          <p className="text-sm text-slate-500">
            {dayLessons.length === 0 ? 'Нет занятий' : `${dayLessons.length} ${dayLessons.length === 1 ? 'занятие' : 'занятий'}`}
          </p>
        </div>

        <div className="space-y-3 animate-fade-in">
          {dayLessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Icon name="CalendarX" size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-500 mb-2">Занятий нет</p>
              <p className="text-xs text-slate-400">Нажмите + чтобы добавить</p>
            </div>
          ) : (
            dayLessons.map((lesson, idx) => (
              <Card
                key={lesson.id}
                className="border-l-4 shadow-sm hover:shadow-md transition-all overflow-hidden"
                style={{ borderLeftColor: lesson.color }}
                onClick={() => handleEditLesson(lesson)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-start pt-1">
                      <span className="text-lg font-bold text-slate-900">{lesson.startTime}</span>
                      <div className="w-px h-8 bg-slate-200 my-1" />
                      <span className="text-sm text-slate-500">{lesson.endTime}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-900 mb-2 truncate">
                        {lesson.subject}
                      </h3>
                      
                      <div className="space-y-1.5">
                        {lesson.teacher && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Icon name="User" size={16} className="flex-shrink-0" />
                            <span className="truncate">{lesson.teacher}</span>
                          </div>
                        )}
                        {lesson.room && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Icon name="MapPin" size={16} className="flex-shrink-0" />
                            <span>{lesson.room}</span>
                          </div>
                        )}
                      </div>

                      {idx < dayLessons.length - 1 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-400">
                            Перерыв {calculateBreak(lesson.endTime, dayLessons[idx + 1].startTime)}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLesson(lesson.id);
                      }}
                      className="flex-shrink-0"
                    >
                      <Icon name="Trash2" size={18} className="text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          <SheetHeader className="text-left mb-6">
            <SheetTitle>{editingLesson ? 'Редактировать занятие' : 'Новое занятие'}</SheetTitle>
            <SheetDescription>
              Заполните информацию о занятии
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 overflow-y-auto h-[calc(90vh-180px)] pb-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Предмет *</Label>
              <Input
                id="subject"
                value={newLesson.subject}
                onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                placeholder="Математика"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Преподаватель</Label>
              <Input
                id="teacher"
                value={newLesson.teacher}
                onChange={(e) => setNewLesson({ ...newLesson, teacher: e.target.value })}
                placeholder="Иванов И.И."
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Аудитория</Label>
              <Input
                id="room"
                value={newLesson.room}
                onChange={(e) => setNewLesson({ ...newLesson, room: e.target.value })}
                placeholder="Каб. 205"
                className="text-base"
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
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Конец *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newLesson.endTime}
                  onChange={(e) => setNewLesson({ ...newLesson, endTime: e.target.value })}
                  className="text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">День недели</Label>
              <select
                id="dayOfWeek"
                value={newLesson.dayOfWeek}
                onChange={(e) => setNewLesson({ ...newLesson, dayOfWeek: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-base"
              >
                {daysOfWeekFull.map((day, index) => (
                  <option key={index} value={index + 1}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Button onClick={handleAddLesson} className="w-full h-12 text-base">
              <Icon name="Check" size={20} className="mr-2" />
              {editingLesson ? 'Сохранить изменения' : 'Добавить занятие'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Index;
