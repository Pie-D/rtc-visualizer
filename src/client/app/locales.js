import { useSelector } from 'react-redux'

const locales = {
  en: {
    dashboardSubtitle: 'C-Meet Real-time Connection Quality & Call Statistics Dashboard',
    searchBy: 'Search files by',
    conferenceLabel: 'Conference name or URL (optional)',
    conferencePlaceholder: 'thisismyconference (or empty for all)',
    minDate: 'Min Date',
    maxDate: 'Max Date',
    search: 'Search',
    searchTook: 'Search took {time} s',
    nothingFound: 'Nothing was found',
    tryNewSearch: 'Try a new search',
    sortBy: 'Sort by',
    sortNone: 'None',
    sortNameAsc: 'Name A-Z',
    sortNameDesc: 'Name Z-A',
    sortJoinAsc: 'Join - Ascending',
    sortJoinDesc: 'Join - Descending',
    sortLeaveAsc: 'Leave - Ascending',
    sortLeaveDesc: 'Leave - Descending',
    other: 'Other',
    participantsCount: 'participants',
    permalink: 'Permalink:',
    conferenceId: 'Conference ID:',
    startTime: 'Start Time:',
    endTime: 'End Time:',
    participants: 'Participants:',
    fileParticipantDetails: 'File / Participant Details',
    joined: 'Joined:',
    left: 'Left:',
    viewStats: 'View Stats',
    downloadDumpFile: 'Download Dump File',
    sessionAnalysis: 'Session Analysis',
    dumpId: 'Dump ID:',
    backToSearch: 'Back to Search',
    statsTab: 'Stats',
    logsTab: 'Logs',
    errorFetch: 'Error fetching data:',
    errorParse: 'Error parsing data:',
    errorStatus: 'Status error:',
    pageOf: 'Page {page} of {pages}',
    prevPage: 'Previous',
    nextPage: 'Next'
  },
  vi: {
    dashboardSubtitle: 'Bảng điều khiển Thống kê Cuộc gọi & Chất lượng Kết nối Thời gian thực C-Meet',
    searchBy: 'Tìm kiếm tệp tin theo',
    conferenceLabel: 'Tên cuộc họp hoặc URL (tùy chọn)',
    conferencePlaceholder: 'Tên cuộc họp (hoặc để trống cho tất cả)',
    minDate: 'Ngày bắt đầu',
    maxDate: 'Ngày kết thúc',
    search: 'Tìm kiếm',
    searchTook: 'Thời gian tìm kiếm: {time} giây',
    nothingFound: 'Không tìm thấy kết quả nào',
    tryNewSearch: 'Thử tìm kiếm khác',
    sortBy: 'Sắp xếp theo',
    sortNone: 'Không',
    sortNameAsc: 'Tên A-Z',
    sortNameDesc: 'Tên Z-A',
    sortJoinAsc: 'Vào - Tăng dần',
    sortJoinDesc: 'Vào - Giảm dần',
    sortLeaveAsc: 'Rời - Tăng dần',
    sortLeaveDesc: 'Rời - Giảm dần',
    other: 'Khác',
    participantsCount: 'người tham gia',
    permalink: 'Liên kết cố định:',
    conferenceId: 'Tên cuộc họp:',
    startTime: 'Thời gian bắt đầu:',
    endTime: 'Thời gian kết thúc:',
    participants: 'Người tham gia:',
    fileParticipantDetails: 'Thông tin Tệp tin / Người tham gia',
    joined: 'Đã tham gia:',
    left: 'Đã rời:',
    viewStats: 'Xem thống kê',
    downloadDumpFile: 'Tải tệp tin Dump',
    sessionAnalysis: 'Phân tích phiên',
    dumpId: 'Mã Dump (Dump ID):',
    backToSearch: 'Quay lại Tìm kiếm',
    statsTab: 'Thống kê',
    logsTab: 'Nhật ký',
    errorFetch: 'Lỗi tải dữ liệu:',
    errorParse: 'Lỗi phân tích dữ liệu:',
    errorStatus: 'Lỗi trạng thái:',
    pageOf: 'Trang {page} / {pages}',
    prevPage: 'Trước',
    nextPage: 'Sau'
  }
}

export const useTranslation = () => {
  const language = useSelector(state => state.config.language) || 'en'

  const t = (key, params = {}) => {
    let translation = locales[language]?.[key] || locales.en?.[key] || key
    Object.entries(params).forEach(([k, v]) => {
      translation = translation.replace(`{${k}}`, v)
    })
    return translation
  }

  return { t, language }
}
