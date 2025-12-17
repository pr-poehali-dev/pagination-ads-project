import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

interface Announcement {
  id: number;
  name: string;
  age: string;
  city: string;
  email: string;
  socials: string;
  text: string;
  userEmail: string;
  createdAt: string;
  likes: number;
  photo?: string;
}

const RUSSIAN_CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
  "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград",
  "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск",
  "Барнаул", "Ульяновск", "Иркутск", "Хабаровск", "Владивосток",
  "Ярославль", "Махачкала", "Томск", "Оренбург", "Кемерово"
];

const generateCaptcha = () => {
  const operations = [
    { q: "5 + 7", a: "12" },
    { q: "10 - 3", a: "7" },
    { q: "6 × 4", a: "24" },
    { q: "8 + 9", a: "17" },
    { q: "15 - 6", a: "9" },
    { q: "7 × 3", a: "21" },
    { q: "12 + 8", a: "20" },
    { q: "20 - 11", a: "9" },
    { q: "9 × 2", a: "18" },
    { q: "6 + 8", a: "14" },
  ];
  return operations[Math.floor(Math.random() * operations.length)];
};

const ITEMS_PER_PAGE = 20;
const MAX_ANNOUNCEMENTS = 200;

const generateMockDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const mockAnnouncements: Announcement[] = [
  { id: 1, name: "Александра", age: "24", city: "Москва", email: "alex@example.com", socials: "@alex_in_msk", text: "Ищу единомышленников для совместных прогулок по городу и посещения культурных мероприятий!", userEmail: "alex@example.com", createdAt: generateMockDate(0), likes: 12 },
  { id: 2, name: "Дмитрий", age: "27", city: "Санкт-Петербург", email: "dmitry@example.com", socials: "@dmitry_spb", text: "Предлагаю услуги репетитора по математике. Опыт работы 5 лет.", userEmail: "dmitry@example.com", createdAt: generateMockDate(1), likes: 8 },
  { id: 3, name: "Екатерина", age: "22", city: "Казань", email: "kate@example.com", socials: "@kate_kzn", text: "Ищу компанию для занятий йогой по выходным. Начинающие приветствуются!", userEmail: "kate@example.com", createdAt: generateMockDate(2), likes: 15 },
  { id: 4, name: "Максим", age: "29", city: "Новосибирск", email: "max@example.com", socials: "@max_nsk", text: "Отдам котят в добрые руки. 2 месяца, приучены к лотку.", userEmail: "max@example.com", createdAt: generateMockDate(3), likes: 24 },
  { id: 5, name: "Анна", age: "25", city: "Екатеринбург", email: "anna@example.com", socials: "@anna_ekb", text: "Организую книжный клуб. Встречи каждую субботу в кафе.", userEmail: "anna@example.com", createdAt: generateMockDate(4), likes: 6 },
  { id: 6, name: "Иван", age: "26", city: "Нижний Новгород", email: "ivan@example.com", socials: "@ivan_nn", text: "Ищу партнера для игры в теннис. Уровень средний.", userEmail: "ivan@example.com", createdAt: generateMockDate(5), likes: 3 },
  { id: 7, name: "Мария", age: "23", city: "Краснодар", email: "maria@example.com", socials: "@maria_krd", text: "Продаю handmade украшения. Уникальные авторские работы!", userEmail: "maria@example.com", createdAt: generateMockDate(6), likes: 19 },
  { id: 8, name: "Артём", age: "28", city: "Владивосток", email: "artem@example.com", socials: "@artem_vvo", text: "Ищу соседа по квартире. Район центральный, все удобства.", userEmail: "artem@example.com", createdAt: generateMockDate(7), likes: 5 },
  { id: 9, name: "София", age: "24", city: "Уфа", email: "sofia@example.com", socials: "@sofia_ufa", text: "Набираю группу на курсы английского языка. Начало в следующем месяце.", userEmail: "sofia@example.com", createdAt: generateMockDate(8), likes: 11 },
  { id: 10, name: "Олег", age: "30", city: "Челябинск", email: "oleg@example.com", socials: "@oleg_chel", text: "Предлагаю услуги фотографа для свадеб и мероприятий.", userEmail: "oleg@example.com", createdAt: generateMockDate(9), likes: 7 },
  { id: 11, name: "Полина", age: "21", city: "Самара", email: "polina@example.com", socials: "@polina_smr", text: "Ищу попутчиков для путешествия по Золотому кольцу.", userEmail: "polina@example.com", createdAt: generateMockDate(10), likes: 14 },
  { id: 12, name: "Сергей", age: "35", city: "Омск", email: "sergey@example.com", socials: "@sergey_omsk", text: "Продаю велосипед в отличном состоянии. Цена договорная.", userEmail: "sergey@example.com", createdAt: generateMockDate(11), likes: 9 },
  { id: 13, name: "Виктория", age: "26", city: "Ростов-на-Дону", email: "vika@example.com", socials: "@vika_rnd", text: "Набираю учеников на курсы рисования маслом.", userEmail: "vika@example.com", createdAt: generateMockDate(12), likes: 18 },
  { id: 14, name: "Алексей", age: "32", city: "Красноярск", email: "alex2@example.com", socials: "@alex_krsk", text: "Ищу напарника для открытия кофейни в центре города.", userEmail: "alex2@example.com", createdAt: generateMockDate(13), likes: 22 },
  { id: 15, name: "Дарья", age: "23", city: "Воронеж", email: "darya@example.com", socials: "@darya_vrn", text: "Организую вечера настольных игр. Присоединяйтесь!", userEmail: "darya@example.com", createdAt: generateMockDate(14), likes: 13 },
  { id: 16, name: "Николай", age: "29", city: "Пермь", email: "nikolay@example.com", socials: "@nikolay_prm", text: "Ищу команду для участия в марафоне.", userEmail: "nikolay@example.com", createdAt: generateMockDate(15), likes: 10 },
  { id: 17, name: "Елена", age: "27", city: "Волгоград", email: "elena@example.com", socials: "@elena_vlg", text: "Предлагаю услуги визажиста. Опыт более 7 лет.", userEmail: "elena@example.com", createdAt: generateMockDate(16), likes: 16 },
  { id: 18, name: "Кирилл", age: "25", city: "Саратов", email: "kirill@example.com", socials: "@kirill_srt", text: "Ищу соавтора для написания книги о путешествиях.", userEmail: "kirill@example.com", createdAt: generateMockDate(17), likes: 4 },
  { id: 19, name: "Татьяна", age: "31", city: "Тюмень", email: "tatyana@example.com", socials: "@tatyana_tmn", text: "Провожу мастер-классы по изготовлению мыла ручной работы.", userEmail: "tatyana@example.com", createdAt: generateMockDate(18), likes: 20 },
  { id: 20, name: "Владимир", age: "34", city: "Тольятти", email: "vladimir@example.com", socials: "@vladimir_tlt", text: "Ищу партнеров для игры в волейбол по выходным.", userEmail: "vladimir@example.com", createdAt: generateMockDate(19), likes: 8 },
  { id: 21, name: "Ольга", age: "28", city: "Ижевск", email: "olga@example.com", socials: "@olga_izh", text: "Набираю группу для изучения испанского языка.", userEmail: "olga@example.com", createdAt: generateMockDate(20), likes: 12 },
];

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [likedAnnouncements, setLikedAnnouncements] = useState<Set<number>>(new Set());
  const [userIp, setUserIp] = useState<string>("");

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    
    const storedLikes = localStorage.getItem("likedAnnouncements");
    if (storedLikes) {
      setLikedAnnouncements(new Set(JSON.parse(storedLikes)));
    }
    
    const mockIp = "192.168.1." + Math.floor(Math.random() * 255);
    setUserIp(mockIp);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    toast.success("Выход выполнен");
  };

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    email: "",
    socials: "",
    text: "",
    captcha: "",
    photo: "",
  });

  const [currentCaptcha, setCurrentCaptcha] = useState(generateCaptcha());
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAnnouncements = announcements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.captcha !== currentCaptcha.a) {
      toast.error(`Неверная капча! Попробуйте ещё раз.`);
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now(),
      name: formData.name,
      age: formData.age,
      city: formData.city,
      email: formData.email,
      socials: formData.socials,
      text: formData.text,
      userEmail: formData.email,
      createdAt: new Date().toISOString(),
      likes: 0,
      photo: formData.photo || undefined,
    };

    let updatedAnnouncements = [newAnnouncement, ...announcements];
    
    if (updatedAnnouncements.length > MAX_ANNOUNCEMENTS) {
      updatedAnnouncements = updatedAnnouncements.slice(0, MAX_ANNOUNCEMENTS);
      toast.info("Старые объявления удалены автоматически");
    }

    setAnnouncements(updatedAnnouncements);
    setCurrentUserEmail(formData.email);
    setFormData({ name: "", age: "", city: "", email: "", socials: "", text: "", captcha: "", photo: "" });
    setPhotoPreview(null);
    setCurrentCaptcha(generateCaptcha());
    setDialogOpen(false);
    toast.success("Объявление успешно добавлено!");
  };

  const handleDelete = (id: number, userEmail: string) => {
    if (!isAdmin && userEmail !== currentUserEmail) {
      toast.error("Вы можете удалять только свои объявления!");
      return;
    }
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Объявление удалено");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Размер файла не должен превышать 5 МБ");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, photo: result }));
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: "" }));
    setPhotoPreview(null);
  };

  const handleLike = (id: number) => {
    if (likedAnnouncements.has(id)) {
      toast.error("Вы уже поставили лайк этому объявлению!");
      return;
    }

    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, likes: announcement.likes + 1 }
        : announcement
    ));

    const newLikedSet = new Set(likedAnnouncements);
    newLikedSet.add(id);
    setLikedAnnouncements(newLikedSet);
    localStorage.setItem("likedAnnouncements", JSON.stringify(Array.from(newLikedSet)));
    toast.success("Лайк поставлен!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "только что";
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} д. назад`;
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-pink-50/30">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="Megaphone" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DoskaBoard
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Категории</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">О проекте</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
              {isAdmin && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Icon name="Shield" size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">Администратор</span>
                </div>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                >
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выйти
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/admin")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Icon name="Shield" size={18} className="mr-2" />
                  Админ
                </Button>
              )}
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить объявление
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Новое объявление</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Введите ваше имя"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Возраст</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Введите возраст"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)} required>
                      <SelectTrigger className="border-2 focus:border-primary">
                        <SelectValue placeholder="Выберите город" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {RUSSIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@mail.com"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socials">Соцсети</Label>
                    <Input
                      id="socials"
                      required
                      value={formData.socials}
                      onChange={(e) => handleInputChange("socials", e.target.value)}
                      placeholder="@username"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text">Текст объявления</Label>
                    <Textarea
                      id="text"
                      required
                      value={formData.text}
                      onChange={(e) => handleInputChange("text", e.target.value)}
                      placeholder="Расскажите подробнее о вашем объявлении..."
                      className="border-2 focus:border-primary min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.text.length}/500</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">Фото (необязательно)</Label>
                    {photoPreview ? (
                      <div className="relative">
                        <img 
                          src={photoPreview} 
                          alt="Предпросмотр" 
                          className="w-full h-40 object-cover rounded-lg border-2 border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={handleRemovePhoto}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <Label htmlFor="photo" className="cursor-pointer flex flex-col items-center gap-2">
                          <Icon name="Upload" size={32} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Нажмите для загрузки фото</span>
                          <span className="text-xs text-muted-foreground">До 5 МБ</span>
                        </Label>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captcha">Капча: Сколько будет {currentCaptcha.q}?</Label>
                    <Input
                      id="captcha"
                      required
                      value={formData.captcha}
                      onChange={(e) => handleInputChange("captcha", e.target.value)}
                      placeholder="Введите ответ"
                      className="border-2 focus:border-primary"
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary text-white hover:opacity-90 transition-opacity">
                    Отправить
                  </Button>
                </form>
              </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Актуальные объявления
          </h2>
          <p className="text-muted-foreground text-lg">Находите интересных людей в вашем городе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentAnnouncements.map((announcement, index) => (
            <Card 
              key={announcement.id} 
              className="hover-scale cursor-pointer border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-2 gradient-primary" />
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {announcement.photo ? (
                    <img 
                      src={announcement.photo} 
                      alt={announcement.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {announcement.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-xl text-foreground">{announcement.name}</h3>
                      {(isAdmin || announcement.userEmail === currentUserEmail) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить объявление?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие нельзя отменить. Объявление будет удалено навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(announcement.id, announcement.userEmail)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Calendar" size={16} className="text-primary" />
                        <span>{announcement.age} лет</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="MapPin" size={16} className="text-secondary" />
                        <span>{announcement.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Mail" size={16} className="text-accent" />
                        <span className="truncate">{announcement.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Users" size={16} className="text-primary" />
                        <span>{announcement.socials}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border mb-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">{announcement.text}</p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(announcement.id)}
                    className={`flex items-center gap-2 h-8 px-3 ${
                      likedAnnouncements.has(announcement.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-muted-foreground hover:text-red-500'
                    }`}
                    disabled={likedAnnouncements.has(announcement.id)}
                  >
                    <Icon 
                      name="Heart" 
                      size={16} 
                      className={likedAnnouncements.has(announcement.id) ? 'fill-current' : ''} 
                    />
                    <span className="font-semibold text-sm">{announcement.likes}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={currentPage === page ? "gradient-primary text-white" : "cursor-pointer hover:bg-primary/10"}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-white/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="text-sm">© 2024 DoskaBoard. Доска объявлений нового поколения</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;