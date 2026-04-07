import { IDiary, IAnniversary, IWish, IAlbum, ICheckin } from '../types';

export const mockDiaries: IDiary[] = [];

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