using System.Windows;
using System.Windows.Media.Animation;
using System.Windows.Controls;

namespace V0AISongwritingApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            // Animate all children: fade-in, scale-up, fly-on
            foreach (UIElement child in ((Grid)Content).Children)
            {
                var fade = new DoubleAnimation(0, 1, new Duration(TimeSpan.FromSeconds(1))) { BeginTime = TimeSpan.FromMilliseconds(200) };
                var scale = new ScaleTransform(0.8, 0.8);
                child.RenderTransform = scale;
                child.RenderTransformOrigin = new Point(0.5, 0.5);
                var scaleAnim = new DoubleAnimation(0.8, 1, new Duration(TimeSpan.FromSeconds(1))) { BeginTime = TimeSpan.FromMilliseconds(200) };
                var trans = new TranslateTransform(0, 80);
                child.RenderTransform = new TransformGroup { Children = { scale, trans } };
                var flyAnim = new DoubleAnimation(80, 0, new Duration(TimeSpan.FromSeconds(1))) { BeginTime = TimeSpan.FromMilliseconds(200) };
                child.BeginAnimation(UIElement.OpacityProperty, fade);
                scale.BeginAnimation(ScaleTransform.ScaleXProperty, scaleAnim);
                scale.BeginAnimation(ScaleTransform.ScaleYProperty, scaleAnim);
                trans.BeginAnimation(TranslateTransform.YProperty, flyAnim);
            }
        }
    }
}
