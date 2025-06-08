import React, { useState } from 'react';
import './components/FAQs.css';

import Header from '../layouts/header-footer/Header';
import Footer from '../layouts/header-footer/Footer';

const faqData = [
    {
        question: "1. Ai có thể tham gia hiến máu?",
        answer: (
            <>
                <ul>
                    <li> Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu để cứu chữa người bệnh.</li>
                    <li> Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg và không quá 500ml mỗi lần.</li>
                    <li> Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.</li>
                    <li> Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.</li>
                    <li> Có giấy tờ tùy thân.</li>
                </ul>
            </>
        ),
    },
    {
        question: "2. Ai là người không nên hiến máu",
        answer: (
            <>
                <ul>
                    <li> Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các vius lây qua đường truyền máu.</li>
                    <li> Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…</li>
                </ul>
            </>
        ),
    },
    {
        question: "3. Máu của tôi sẽ được làm những xét nghiệm gì?",
        answer: (
            <>
                <ul>
                    <li> Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét.</li>
                    <li> Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.</li>
                </ul>
            </>
        ),
    },
    {
        question: "4. Máu gồm những thành phần và chức năng gì?",
        answer: (
            <>
                <p>
                    Máu là một chất lỏng lưu thông trong các mạch máu của cơ thể, gồm nhiều thành phần, mỗi thành phần làm nhiệm vụ khác nhau:
                </p>
                <ul>
                    <li> Hồng cầu làm nhiệm vụ chính là vận chuyển oxy.</li>
                    <li> Bạch cầu làm nhiệm vụ bảo vệ cơ thể.</li>
                    <li> Tiểu cầu tham gia vào quá trình đông cầm máu.</li>
                    <li> Huyết tương: gồm nhiều thành phần khác nhau: kháng thể, các yếu tố đông máu, các chất dinh dưỡng...</li>
                </ul>
            </>
        ),
    },
    {
        question: "5. Tại sao lại có nhiều người cần phải được truyền máu?",
        answer: (
            <>
                <p>
                    Mỗi giờ có hàng trăm người bệnh cần phải được truyền máu vì :
                </p>
                <ul>
                    <li> Bị mất máu do chấn thương, tai nạn, thảm hoạ, xuất huyết tiêu hoá...</li>
                    <li> Do bị các bệnh gây thiếu máu, chảy máu: ung thư máu, suy tuỷ xương, máu khó đông...</li>
                    <li> Các phương pháp điều trị hiện đại cần truyền nhiều máu: phẫu thuật tim mạch, ghép tạng...</li>
                </ul>
            </>
        ),
    },
    {
        question: "6. Nhu cầu máu điều trị ở nước ta hiện nay?",
        answer: (
            <>
                <ul>
                    <li> Mỗi năm nước ta cần khoảng 1.800.000 đơn vị máu điều trị.</li>
                    <li> Máu cần cho điều trị hằng ngày, cho cấp cứu, cho dự phòng các thảm họa, tai nạn cần truyền máu với số lượng lớn.</li>
                    <li> Hiện tại chúng ta đã đáp ứng được khoảng 54% nhu cầu máu cho điều trị.</li>
                </ul>
            </>
        ),
    },

    {
        question: "7. Tại sao khi tham gia hiến máu lại cần phải có giấy CMND?",
        answer: (
            <>
                <p>
                    Mỗi đơn vị máu đều phải có hồ sơ, trong đó có các thông tin về người hiến máu. Theo quy định, đây là một thủ tục cần thiết trong quy trình hiến máu để đảm bảo tính xác thực thông tin về người hiến máu.
                </p>
            </>
        ),
    },
    {
        question: "8. Tại sao lại có nhiều người cần phải được truyền máu?",
        answer: (
            <>
                <p>
                    Hiến máu theo hướng dẫn của thầy thuốc không có hại cho sức khỏe. Điều đó đã được chứng minh bằng các cơ sở khoa học và cơ sở thực tế:
                </p>
                <ul>
                    <li> Cơ sở khoa học: </li>
                    <ul>
                        <li> Máu có nhiều thành phần, mỗi thành phần chỉ có đời sống nhất định và luôn luôn được đổi mới hằng ngày. Ví dụ: Hồng cầu sống được 120 ngày, huyết tương thường xuyên được thay thế và đổi mới. Cơ sở khoa học cho thấy, nếu mỗi lần hiến dưới 1/10 lượng máu trong cơ thể thì không có hại đến sức khỏe.</li>
                        <li> Nhiều công trình nghiên cứu đã chứng minh rằng, sau khi hiến máu, các chỉ số máu có thay đổi chút ít nhưng vẫn nằm trong giới hạn sinh lý bình thường không hề gây ảnh hưởng đến các hoạt động thường ngày của cơ thể.</li>
                    </ul>
                    <li> Cơ sở thực tế: </li>
                    <ul>
                        <li> Thực tế đã có hàng triệu người hiến máu nhiều lần mà sức khỏe vẫn hoàn toàn tốt. Trên thế giới có người hiến máu trên 400 lần. Ở Việt Nam, người hiến máu nhiều lần nhất đã hiến gần 100 lần, sức khỏe hoàn toàn tốt.</li>
                        <li> Như vậy, mỗi người nếu thấy sức khoẻ tốt, không có các bệnh lây nhiễm qua đường truyền máu, đạt tiêu chuẩn hiến máu thì có thể hiến máu từ 3-4 lần trong một năm, vừa không ảnh hưởng xấu đến sức khoẻ của bản thân, vừa đảm bảo máu có chất lượng tốt, an toàn cho người bệnh.</li>
                    </ul>
                </ul>
            </>
        ),
    },
    {
        question: "9. Quyền lợi đối với người hiến máu tình nguyện?",
        answer: (
            <>
                <p>
                    Quyền lợi và chế độ đối với người hiến máu tình nguyện theo Thông tư số 05/2017/TT-BYT Quy định giá tối đa và chi phí phục vụ cho việc xác định giá một đơn vị máu toàn phần, chế phẩm máu đạt tiêu chuẩn:
                </p>
                <ul>
                    <li> Được khám và tư vấn sức khỏe miễn phí.</li>
                    <li>
                        Được kiểm tra và thông báo kết quả các xét nghiệm máu (hoàn toàn bí mật): nhóm máu, HIV, virut viêm gan B, virut viêm gan C, giang mai, sốt rét.
                        Trong trường hợp người hiến máu có nhiễm hoặc nghi ngờ các mầm bệnh này thì sẽ được Bác sĩ mời đến để tư vấn sức khỏe.
                    </li>
                    <li> Được bồi dưỡng và chăm sóc theo các quy định hiện hành:</li>
                    <ul>
                        <li> Phục vụ ăn nhẹ tại chỗ: tương đương 30.000 đồng.</li>
                        <li> Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000 đồng.</li>
                    </ul>
                    <li> Lựa chọn nhận quà tặng bằng hiện vật có giá trị như sau:</li>
                    <ul>
                        <li> Một đơn vị máu thể tích 250 ml: 100.000 đồng.</li>
                        <li> Một đơn vị máu thể tích 350 ml: 150.000 đồng.</li>
                        <li> Một đơn vị máu thể tích 450 ml: 180.000 đồng.</li>
                    </ul>
                    <li>
                        Được cấp giấy chứng nhận hiến máu tình nguyện của Ban chỉ đạo hiến máu nhân đạo Tỉnh, Thành phố. Ngoài giá trị về mặt tôn vinh, giấy chứng nhận hiến máu có giá trị bồi hoàn máu, số lượng máu được bồi hoàn lại tối đa bằng lượng máu người hiến máu đã hiến. Giấy Chứng nhận này có giá trị tại các bệnh viện, các cơ sở y tế công lập trên toàn quốc.
                    </li>
                </ul>
            </>
        ),
    },
    {
        question: "10. Khi hiến máu có thể bị nhiễm bệnh không?",
        answer: (
            <>
                <ul>
                    <li> Kim dây lấy máu vô trùng, chỉ sử dụng một lần cho một người, vì vậy không thể lây bệnh cho người hiến máu.</li>
                    <li> Trước khi hiến máu, người hiến máu được khám sức khỏe, tư vấn và làm các xét nghiệm cần thiết để đảm bảo an toàn cho người hiến máu và người nhận máu.</li>
                </ul>
            </>
        ),
    },
    {
        question: "11. Ngày mai tôi sẽ hiến máu, tôi nên chuẩn bị như thế nào?",
        answer: (
            <>
                <ul>
                    <li> Tối nay bạn không nên thức quá khuya (ngủ trước 23:00).</li>
                    <li> Nên ăn (không nên ăn quá no) và không uống rượu, bia trước khi hiến máu.</li>
                    <li> Mang giấy CMND, đủ giấy tờ tùy thân và thẻ hiến máu(nếu có) khi đi hiến máu.</li>
                </ul>
            </>
        ),
    },
    {
        question: "12. Những trường hợp nào cần phải trì hoãn hiến máu?",
        answer: (
            <>
                <p>
                    Những người phải trì hoãn hiến máu trong 12 tháng kể từ thời điểm:
                </p>
                <ul>
                    <li> Phục hồi hoàn toàn sau cấc can thiệp ngoại khoa.</li>
                    <li> Khỏi bệnh sau khi mắc một trong cấc bệnh sốt rét, giang mai, lao, uốn ván, viêm não, viêm màng não.</li>
                    <li> Kết thúc đợt tiêm vắc xin phòng bệnh dại sau khi bị động vật cắn hoặc tiêm, truyền máu, chế phẩm máu và các chế phẩm sinh học nguồn gốc từ máu.</li>
                    <li> Sinh con hoặc chấm dứt thai nghén.</li>
                </ul>
                <p>
                    Những người phải trì hoãn hiến máu trong 06 tháng kể từ thời điểm:
                </p>
                <ul>
                    <li> Xăm trổ trên da.</li>
                    <li> Bấm dái tai, bấm mũi, bấm rốn hoặc các vị trí khác của cơ thể.</li>
                    <li> Phơi nhiễm với máu và dịch cơ thể từ người có nguy cơ hoặc đã nhiễm các bệnh lây truyền qua đường máu.</li>
                    <li> Khỏi bệnh sau khi mắc một trong các bệnh thương hàn, nhiễm trùng huyết, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tuỷ xương, viêm tụy.</li>
                </ul>
                <p>
                    Những người phải trì hoãn hiến máu trong 04 tuần kể từ thời điểm:
                </p>
                <ul>
                    <li> Khỏi bệnh sau khi mắc một trong các bệnh viêm dạ dày ruột, viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, rubella, tả, quai bị.</li>
                    <li> Kết thúc đợt tiêm vắc xin phòng rubella, sởi, thương hàn, tả, quai bị, thủy đậu, BCG.</li>
                </ul>
                <p>
                    Những người phải trì hoãn hiến máu trong 07 ngày kể từ thời điểm:
                </p>
                <ul>
                    <li> Khỏi bệnh sau khi mắc một trong các bệnh cúm, cảm lạnh, dị ứng mũi họng, viêm họng, đau nửa đầu Migraine.</li>
                    <li> Tiêm các loại vắc xin, trừ các loại đã được quy định tại Điểm c Khoản 1 và Điểm b Khoản 3 Điều này.</li>
                </ul>
                <p>
                    Một số quy định liên quan đến nghề nghiệp và hoạt động đặc thù của người hiến máu: những người làm một số công việc và thực hiện các hoạt động đặc thù sau đây chỉ hiến máu trong ngày nghỉ hoặc chỉ được thực hiện các công việc, hoạt động này sau khi hiến máu tối thiểu 12 giờ:
                </p>
                <ul>
                    <li> Người làm việc trên cao hoặc dưới độ sâu: phi công, lái cần cẩu, công nhân làm việc trên cao, người leo núi, thợ mỏ, thủy thủ, thợ lặn.</li>
                    <li> Người vận hành các phương tiện giao thông công cộng: lái xe buýt, lái tàu hoả, lái tàu thuỷ.</li>
                    <li> Các trường hợp khác: vận động viên chuyên nghiệp, người vận động nặng, tập luyện nặng.</li>
                </ul>
            </>
        ),
    },
    {
        question: "13.  Khi phát hiện bất thường, cảm thấy không an toàn với túi máu vừa hiến",
        answer: (
            <>
                <p>
                    Sau khi tham gia hiến máu, nếu phát hiện có bất cứ điều gì khiến bạn cảm thấy không an toàn với túi máu vừa hiến (chợt nhớ ra 1 hành vi nguy cơ, có sử dụng loại thuốc nào đó mà bạn quên báo bác sĩ khi thăm khám, có xét nghiệm "DƯƠNG TÍNH" với SarS-CoV-2 bằng kỹ thuật test nhanh hoặc Real time RT-PCR,...) vui lòng báo lại cho đơn vị tiếp nhận túi máu nơi mà bạn đã tham gia hiến.
                </p>
            </>
        ),
    },
    {
        question: "14. Cảm thấy không khỏe sau khi hiến máu?",
        answer: (
            <>
                <p>
                    Sau khi hiến máu, nếu có các triệu chứng chóng mặt, mệt mỏi, buồn nôn,... hãy liên hệ ngay cho đơn vị tiếp nhận máu để được hỗ trợ về mặt y khoa.
                </p>
            </>
        ),
    },
    {
        question: "15. Có dấu hiệu sưng, phù nơi vết chích?",
        answer: (
            <>
                <p>
                    Sau khi hiến máu, nếu bạn có các dấu hiệu sưng, phù nơi vết chích. Xin đừng quá lo lắng, hãy chườm lạnh ngay vị trí sưng đó và theo dõi các dấu hiệu trên, nếu không giảm sau 24 giờ hãy liên hệ lại cho đơn vị tiếp nhận máu để được hỗ trợ.
                </p>
            </>
        ),
    },

];

const FAQs: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <Header />
            <div className="faq-container">
                <h2 className="faq-title">Các câu hỏi thường gặp</h2>
                {faqData.map((item, index) => (
                    <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                        <div className="faq-question" onClick={() => toggle(index)}>
                            {item.question}
                            <span className="faq-icon">{openIndex === index ? '▴' : '▾'}</span>
                        </div>
                        {openIndex === index && (
                            <div className="faq-answer">{item.answer || <i>(Nội dung đang cập nhật...)</i>}</div>
                        )}
                    </div>
                ))}
            </div>
            <Footer />

        </div>
    );
};

export default FAQs;