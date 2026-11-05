"use strict";

$(function () {
    $.ajax({
        type: "GET",
        url: "https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193",
        dataType: "json",
        success: function (data) {
            $("#myList").empty();
            var fallbackPic = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='130' height='90' viewBox='0 0 130 90' fill='%23CBD5E1'><rect width='130' height='90'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%230F172A'>🍴 No Image</text></svg>";

            $.each(data.slice(0, 50), function (i, item) {
                var name = item.Name || '未提供';
                var pic = item.PicURL || fallbackPic;
                var tel = item.Tel || '未提供';
                var addr = item.Address || '未提供';
                var mapUrl = (item.Latitude && item.Longitude)
                    ? `https://www.google.com/maps/dir/?api=1&destination=${item.Latitude},${item.Longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + addr)}`;

                $("#myList").append(`
                    <tr>
                        <td data-th="餐廳名稱"><span class="fw-bold">${name}</span></td>
                        <td data-th="圖片"><span class="img-container"><img src="${pic}" alt="${name}" onerror="this.onerror=null;this.src='${fallbackPic}';"></span></td>
                        <td data-th="電話"><span>${tel}</span></td>
                        <td data-th="住址"><span>${addr}</span></td>
                        <td data-th="位置導航"><span><a href="${mapUrl}" target="_blank" class="btn-map">📍 開啟導航</a></span></td>
                    </tr>
                `);
            });
        },
        error: function () {
            $("#myList").html('<tr><td colspan="5" class="text-center py-4 text-danger">⚠️ 美食開放資料抓取失敗，請稍後再試！</td></tr>');
        }
    });
});