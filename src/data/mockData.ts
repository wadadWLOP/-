import { IDiary, IAnniversary, IWish, IAlbum, ICheckin } from '../types';

export const mockDiaries: IDiary[] = [
  {
    id: '1',
    title: '第一次约会',
    content: '<p>今天是我们的第一次约会，心情既紧张又兴奋。我们一起去了那家传说中的咖啡店，点了两杯拿铁，坐在靠窗的位置聊了很久很久...</p>',
    date: '2024-02-14',
    mood: 'sweet',
    images: ['https://picsum.photos/seed/date1/400/300'],
    createdAt: '2024-02-14T10:00:00Z',
  },
  {
    id: '2',
    title: '一起看日落',
    content: '<p>下班后他突然说要带我去一个特别的地方，原来是城郊的山顶！我们赶在太阳落山前爬到了山顶，看到了最美的日落...</p>',
    date: '2024-02-20',
    mood: 'touched',
    images: ['https://picsum.photos/seed/sunset1/400/300'],
    createdAt: '2024-02-20T18:30:00Z',
  },
  {
    id: '3',
    title: '难忘的生日惊喜',
    content: '<p>没想到他记得我的生日！一早就收到了花束，晚上更是被带去了我一直想去的餐厅，感动到哭...</p>',
    date: '2024-03-15',
    mood: 'happy',
    images: ['https://picsum.photos/seed/bday1/400/300', 'https://picsum.photos/seed/bday2/400/300'],
    createdAt: '2024-03-15T20:00:00Z',
  },
];

export const mockAnniversaries: IAnniversary[] = [
  {
    id: '1',
    title: '在一起纪念日',
    date: '2023-01-01',
    isLunar: false,
    isRecurring: true,
    icon: '💕',
    description: '我们正式在一起的日子',
  },
  {
    id: '2',
    title: '第一次约会',
    date: '2023-02-14',
    isLunar: false,
    isRecurring: true,
    icon: '💑',
    description: '甜蜜的第一次约会',
  },
  {
    id: '3',
    title: '她的生日',
    date: '1998-05-20',
    isLunar: false,
    isRecurring: true,
    icon: '🎂',
    description: '',
  },
  {
    id: '4',
    title: '下次旅行',
    date: '2024-06-01',
    isLunar: false,
    isRecurring: false,
    icon: '✈️',
    description: '计划中的厦门之旅',
  },
];

export const mockWishes: IWish[] = [
  {
    id: '1',
    title: '一起看海',
    description: '想在海边看日出日落，踩着沙滩散步',
    expectedDate: '2024-07-01',
    coverImage: 'https://picsum.photos/seed/sea1/400/300',
    status: 'pending',
  },
  {
    id: '2',
    title: '学做对方爱吃的菜',
    description: '他喜欢川菜，我想学做给他吃',
    status: 'completed',
    completedDate: '2024-02-01',
    completedNote: '成功做出了麻婆豆腐！',
    completedImages: ['https://picsum.photos/seed/food1/400/300'],
  },
  {
    id: '3',
    title: '一起看演唱会',
    description: '想和他一起去看周杰伦的演唱会',
    status: 'pending',
  },
  {
    id: '4',
    title: '养一只小猫咪',
    description: '我们都很喜欢猫咪，想养一只布偶猫',
    status: 'pending',
    coverImage: 'https://picsum.photos/seed/cat1/400/300',
  },
];

export const mockAlbums: IAlbum[] = [
  {
    id: '1',
    name: '约会合集',
    coverImage: 'https://picsum.photos/seed/album1/400/300',
    photoCount: 24,
    photos: [],
  },
  {
    id: '2',
    name: '旅行记忆',
    coverImage: 'https://picsum.photos/seed/album2/400/300',
    photoCount: 56,
    photos: [],
  },
  {
    id: '3',
    name: '日常点滴',
    coverImage: 'https://picsum.photos/seed/album3/400/300',
    photoCount: 89,
    photos: [],
  },
];

export const mockCheckins: ICheckin[] = [
  {
    id: '1',
    title: '一起看海',
    description: '去海边看日出日落',
    icon: '🌊',
    isCompleted: true,
    completedDate: '2024-01-15',
    completedProof: '在三亚天涯海角拍的照片',
    category: 'travel',
  },
  {
    id: '2',
    title: '一起做饭',
    description: '学习烹饪对方爱吃的菜',
    icon: '🍳',
    isCompleted: true,
    completedDate: '2024-02-10',
    completedProof: '成功做出了爱心便当',
    category: 'food',
  },
  {
    id: '3',
    title: '看日出',
    description: '早起看日出',
    icon: '🌅',
    isCompleted: false,
    category: 'activity',
  },
  {
    id: '4',
    title: '一起健身',
    description: '每周至少三次一起去健身房',
    icon: '💪',
    isCompleted: false,
    category: 'activity',
  },
  {
    id: '5',
    title: '打卡网红餐厅',
    description: '每月尝试一家新的餐厅',
    icon: '🍽️',
    isCompleted: true,
    completedDate: '2024-02-28',
    completedProof: '发现了一家超棒的日料店',
    category: 'food',
  },
];